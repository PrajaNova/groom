# PayPal Integration Test Guide

This guide will walk you through setting up and testing the PayPal integration locally.

## 1. Get Sandbox Credentials
1. Go to the [PayPal Developer Dashboard](https://developer.paypal.com/).
2. Log in with your PayPal account and navigate to the **Apps & Credentials** tab.
3. Switch the environment toggle to **Sandbox**.
4. Create a new app (e.g. `Groom Checkout`).
5. Once created, copy the **Client ID** and **Secret**.

## 2. Set Up Environment Variables

**Backend (`packages/groom-backend/.env`):**
Add or update the following variables:
```
# Sandbox Credentials
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

**Frontend (`packages/groom-web/.env.local` or `.env` depending on your setup):**
Add or update the following variable:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
```

*(Note: Without the correct `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, the PayPal buttons on the frontend will render in a mock generic mode, and `test` or `sb` client ID might prevent sandbox payments from succeeding).*

## 3. Testing the Booking Flow

1. Restart the backend and frontend servers so the updated `.env` values apply:
   ```bash
   pnpm run dev
   ```
2. Navigate to `/book-session` in the frontend app.
3. Fill out the **Session Details** form and hit "Book Session".
4. The screen will transition to the payment step and load standard PayPal buttons.
5. Click the yellow **PayPal** button. This opens the sandbox pop-up window.
6. Login using a **Sandbox Personal (Buyer) Test Account** generated from your Developer Dashboard.
7. Complete the checkout process in the mockup flow.
8. Upon successful approval, the modal will close, triggering the frontend to verify the payment with your backend.
9. A final success modal reading "Booking Confirmed!" will appear.
10. Check the database and terminal logs to ensure:
    - The `Booking` row has `status: 'confirmed'`.
    - An email containing the **Amount Paid** (Receipt) was triggered to be sent via Resend.
