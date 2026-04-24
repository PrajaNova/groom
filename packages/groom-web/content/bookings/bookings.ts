export const bookingsContent = {
  header: {
    bookTitle: "Book Your Session",
    paymentTitle: "Complete Payment",
  },
  form: {
    labels: {
      name: "Full Name",
      email: "Email Address",
      service: "Service Type",
      date: "Preferred Date & Time",
      reason: "What would you like to discuss?",
    },
    placeholders: {
      name: "Enter your full name",
      email: "Enter your email",
      service: "Select a service",
      reason: "Tell us about your situation...",
    },
    helpText: "Please select a date at least 24 hours in advance",
    submitButton: "Book Session",
    loadingButton: "Booking...",
  },
  payment: {
    instruction: "Please complete your payment via PayPal to confirm your booking.",
    processing: "Processing...",
    errorGateway: "Payment gateway is not configured. Please contact support.",
    backButton: "← Back to booking form",
  },
  success: {
    title: "Booking Confirmed!",
    message: "Your session is confirmed. You will receive an email shortly with the meeting link and receipt.",
    labels: {
      service: "Service:",
      date: "Requested Date:",
      status: "Status:",
    },
    statusText: "Confirmed",
    viewBookingsButton: "View My Bookings",
  },
};
