# 💳 Razorpay Test Payment Guide

## Setup

### Backend (.env)
```bash
# Add these to packages/groom-backend/.env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Frontend (.env.local)
```bash
# Add these to packages/groom-web/.env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

## How to Get Test Keys

1. **Sign up at Razorpay**: https://dashboard.razorpay.com/signup
2. **Navigate to Settings → API Keys**
3. **Generate Test Keys** (they start with `rzp_test_`)
4. Copy both:
   - **Key ID**: `rzp_test_XXXXXXXXXXXX` (public, used in frontend)
   - **Key Secret**: `XXXXXXXXXX` (private, used in backend)

⚠️ **Never commit real keys to Git!**

## Testing Mock Payments

### Test Card Numbers (Razorpay Test Mode)

#### ✅ Successful Payment
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

#### ❌ Failed Payment
- **Card Number**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

#### 💰 International Cards
- **Visa**: `4012 8888 8888 1881`
- **Mastercard**: `5104 0600 0000 0008`
- **Amex**: `3782 822463 10005`

### Test UPI IDs
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Test Netbanking
- Any bank in test mode will work with the credentials provided on the test payment page

## Payment Flow

1. **User fills booking form** → `/book-session`
2. **Clicks "Proceed to Payment"**
3. **Backend creates Razorpay order** → `POST /api/bookings/initiate`
4. **Razorpay modal opens** with test payment options
5. **User enters test card details**
6. **Razorpay processes payment** and returns response
7. **Frontend verifies signature** → `POST /api/bookings/verify`
8. **Backend confirms booking** → Updates status to `confirmed`
9. **Confirmation email sent** to user

## Testing Steps

### 1. Start Your Servers
```bash
# Terminal 1 - Backend
cd packages/groom-backend
pnpm dev

# Terminal 2 - Frontend
cd packages/groom-web
pnpm dev
```

### 2. Book a Session
1. Navigate to http://localhost:3000
2. Click "Book Session" (login if needed)
3. Fill the form:
   - Name: Your Name
   - Email: test@example.com
   - Date/Time: Future date
   - Reason: Test booking
4. Click "Proceed to Payment"

### 3. Test Payment Modal Opens
You'll see Razorpay's test payment interface

### 4. Complete Test Payment
- Choose "Card" option
- Enter test card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Click "Pay ₹500"

### 5. Verify Success
- Toast notification: "Booking confirmed!"
- Redirects to `/my-bookings`
- Check database: booking status should be `confirmed`
- Check email: confirmation email sent

## Testing Failure Scenarios

### Test Payment Failure
1. Use failure card: `4000 0000 0000 0002`
2. Payment will fail
3. Booking remains in `payment_pending` state
4. User can retry payment

### Test Signature Verification Failure
The backend automatically validates Razorpay signature. If tampered, it will return:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid payment signature"
}
```

### Test Network Failure
1. Disconnect internet before clicking "Pay"
2. Razorpay will show error
3. Booking still in `payment_pending`
4. User can navigate back and retry

## Checking Test Payments

### In Razorpay Dashboard
1. Go to https://dashboard.razorpay.com
2. Switch to **Test Mode** (toggle at top)
3. Navigate to **Transactions → Payments**
4. See all test payments with status

### In Your Database
Query bookings:
```sql
SELECT * FROM groom.bookings 
WHERE status = 'confirmed' 
ORDER BY "createdAt" DESC;
```

### In Backend Logs
Check terminal output for:
- Order creation
- Payment verification
- Email sending status

## Troubleshooting

### Razorpay Modal Doesn't Open
**Issue**: Script not loaded
```
✅ Check browser console for errors
✅ Verify NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local
✅ Check if script loaded: https://checkout.razorpay.com/v1/checkout.js
```

### Payment Verification Fails
**Issue**: Signature mismatch
```
✅ Ensure RAZORPAY_KEY_SECRET matches in backend .env
✅ Check backend logs for signature comparison
✅ Verify orderId matches between initiate and verify
```

### No Confirmation Email
**Issue**: Email service not configured
```
✅ Check RESEND_API_KEY in backend .env
✅ Check backend logs for email errors
✅ Booking still gets confirmed (email is async)
```

### "Payment gateway not configured" Error
**Issue**: Backend missing Razorpay keys
```
✅ Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env
✅ Restart backend server
✅ Check logs: should NOT see "Razorpay credentials missing"
```

## CLI Test Command

You can also test payment initiation via API:

```bash
# Initiate payment order
curl -X POST http://localhost:3002/api/bookings/initiate \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "when": "2026-03-01T10:00:00Z",
    "reason": "Test booking"
  }'
```

## Production Checklist

Before going live:

- [ ] Replace test keys with **live keys** (start with `rzp_live_`)
- [ ] Test with real small amount (₹1)
- [ ] Enable webhooks for payment status updates
- [ ] Add refund handling logic
- [ ] Test on mobile devices
- [ ] Add payment retry mechanism
- [ ] Set up monitoring for failed payments
- [ ] Configure tax/GST if applicable
- [ ] Add invoice generation
- [ ] Test international payments if needed

## Resources

- **Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Integration Docs**: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- **API Reference**: https://razorpay.com/docs/api/
- **Webhooks**: https://razorpay.com/docs/webhooks/

---

**Current Payment Amount**: ₹500 (50000 paise)  
**Default Currency**: INR

To change amount, modify in backend:
```typescript
// packages/groom-backend/src/services/booking.service.ts
const amount = data.amount || 50000; // Change this value
```
