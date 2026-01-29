// Central export for all services
// Now using native fetch - works in both Client and Server Components!

export { default as bookingService } from "./bookingService";
export { default as groomService } from "./groomService";
export { default as userService } from "./userService";

// Export types
export type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
} from "./bookingService";
export type { Blog, Confession, CreateConfessionData } from "./groomService";
export type { User, LoginCredentials, RegisterData } from "./userService";
