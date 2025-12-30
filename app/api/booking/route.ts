import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import BookingDB from "##/DataBase/BookingDB";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const newBooking = await BookingDB.createBooking(body);
    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (email) {
      const bookings = await BookingDB.getBookingsByEmail(email);
      return NextResponse.json(bookings, { status: 200 });
    }

    const statusParam = url.searchParams.get("status");
    const fromDateParam = url.searchParams.get("fromDate");

    const filters: {
      status?: string[];
      fromDate?: Date;
      sort?: "asc" | "desc";
    } = {};

    if (statusParam) {
      filters.status = statusParam.split(",");
    }

    if (fromDateParam) {
      const date = new Date(fromDateParam);
      if (!Number.isNaN(date.getTime())) {
        filters.fromDate = date;
      }
    }

    const sortParam = url.searchParams.get("sort");
    if (sortParam === "asc" || sortParam === "desc") {
      filters.sort = sortParam;
    }

    const bookings = await BookingDB.getBookings(filters);
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
