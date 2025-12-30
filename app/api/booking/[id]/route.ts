import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import BookingDB from "##/DataBase/BookingDB";
import {
  generateJitsiUrl,
  generateMeetingId,
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail,
  sendBookingUpdateEmail,
} from "##/utils/email";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (id) {
      const bookingById = await BookingDB.getBookingById(id);
      return NextResponse.json(bookingById, { status: 200 });
    }

    return NextResponse.json(
      { error: "Missing booking id or email" },
      { status: 400 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking id in path" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Get the existing booking
    const existingBooking = await BookingDB.getBookingById(id);

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if this is a confirmation request
    if (body.status === "confirmed") {
      // Generate meeting ID if not already present
      const meetingId =
        existingBooking.meetingId || generateMeetingId(existingBooking.email);

      // Update booking with meeting ID and confirmed status
      const updatedBooking = await BookingDB.updateBooking({
        id,
        status: "confirmed",
        meetingId,
      });

      // Send confirmation email
      try {
        await sendBookingConfirmationEmail({
          to: existingBooking.email,
          name: existingBooking.name,
          scheduledTime: new Date(existingBooking.when),
          meetingId,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails - booking is still confirmed
      }
      revalidatePath("/bookings");
      revalidatePath("/admin/bookings");
      return NextResponse.json(
        {
          ...updatedBooking,
          meetingUrl: generateJitsiUrl(meetingId),
        },
        { status: 200 },
      );
    }

    // Check for rescheduling (when date changes)
    if (body.when && body.when !== existingBooking.when.toISOString()) {
      const newTime = new Date(body.when as string);

      // Send rescheduling email
      try {
        await sendBookingUpdateEmail({
          to: existingBooking.email,
          name: existingBooking.name,
          newTime,
          meetingId: existingBooking.meetingId || undefined,
        });
      } catch (emailError) {
        console.error("Failed to send rescheduling email:", emailError);
      }
    }

    // For other updates
    const updatedBooking = await BookingDB.updateBooking({ id, ...body });
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking id in path" },
        { status: 400 },
      );
    }

    // Get details before "cancelling"
    const booking = await BookingDB.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update status to cancelled instead of deleting
    await BookingDB.updateBooking({
      id,
      status: "cancelled",
    });

    // Send cancellation email
    try {
      await sendBookingCancellationEmail({
        to: booking.email,
        name: booking.name,
        originalTime: booking.when,
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
    }

    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");
    return NextResponse.json(
      { message: "Booking cancelled successfully" },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
