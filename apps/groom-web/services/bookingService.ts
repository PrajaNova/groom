import { fetchAPI } from "./api";

export interface Booking {
  id: string;
  name: string;
  email: string;
  when: string;
  reason: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  userId?: string;
  meetingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  name: string;
  email: string;
  when: string;
  reason: string;
  userId?: string;
}

export interface UpdateBookingData {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  when?: string;
  reason?: string;
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

  async create(data: CreateBookingData): Promise<Booking> {
    return fetchAPI(this.basePath, {
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
