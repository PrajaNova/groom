// Central export for all services
// Now using native fetch - works in both Client and Server Components!

// Export types
export type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
} from "./bookingService";
export { default as bookingService } from "./bookingService";
export type {
  Confession,
  CreateConfessionData,
  RenderBlog,
} from "./groomService";
export { default as groomService } from "./groomService";
export type { LoginCredentials, RegisterData, User } from "./userService";
export { default as userService } from "./userService";
