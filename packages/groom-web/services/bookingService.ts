import { fetchAPI } from "./api";

export interface Booking {
  id: string;
  name: string;
  email: string;
  when: string;
  service?: string;
  reason: string;
  status:
    | "pending"
    | "payment_pending"
    | "confirmed"
    | "completed"
    | "cancelled";
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
  serviceType?: string;
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
  order: any;
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
    const backendData = {
      ...data,
      service: data.serviceType,
    };
    return fetchAPI(this.basePath, {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  }

  // Step 1: Initiate Booking & Payment Order
  async initiate(data: CreateBookingData): Promise<InitiateResponse> {
    const backendData = {
      ...data,
      service: data.serviceType,
    };
    return fetchAPI(`${this.basePath}/initiate`, {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  }

  // Step 2: Verify Payment
  async verify(data: {
    bookingId: string;
    paypalOrderId: string;
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
