import { fetchAPI } from "./api";

export interface Booking {
  id: string;
  name: string;
  email: string;
  when: string;
  reason: string;
  status: "pending" | "payment_pending" | "confirmed" | "completed" | "cancelled";
  userId?: string;
  meetingId?: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  name: string;
  email: string;
  when: string;
  reason: string;
  userId?: string;
  amount?: number;
}

export interface UpdateBookingData {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  when?: string;
  reason?: string;
}

export interface InitiateResponse {
  booking: Booking;
  order: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
  };
}

class BookingService {
  private basePath = "/api/bookings";

  async getAll(params?: {
    status?: string;
    fromDate?: string;
    userId?: string;
  }): Promise<Booking[]> {
    return fetchAPI(this.basePath, { params, cache: "no-store" });
  }

  async getById(id: string): Promise<Booking> {
    return fetchAPI(`${this.basePath}/${id}`, { cache: "no-store" });
  }

  // Manual create (admin or legacy)
  async create(data: CreateBookingData): Promise<Booking> {
    return fetchAPI(this.basePath, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Step 1: Initiate Booking & Payment Order
  async initiate(data: CreateBookingData): Promise<InitiateResponse> {
    return fetchAPI(`${this.basePath}/initiate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Step 2: Verify Payment
  async verify(data: {
    bookingId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }): Promise<Booking> {
    return fetchAPI(`${this.basePath}/verify`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    return fetchAPI(`${this.basePath}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    await fetchAPI(`${this.basePath}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new BookingService();
