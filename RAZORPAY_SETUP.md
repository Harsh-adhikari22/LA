# Razorpay Integration Setup Guide

This guide walks you through setting up Razorpay payment gateway integration for your e-commerce platform.

## Prerequisites

- Razorpay account (Sign up at https://razorpay.com)
- Node.js and npm/pnpm installed
- Your existing Next.js/Supabase setup

## Installation Steps

### 1. Install Dependencies

The `razorpay` package has already been added to `package.json`. Install it:

```bash
pnpm install
# or
npm install
```

### 2. Create Supabase Tables

Run the migration script to create the orders tables:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the contents of `scripts/005_create_orders.sql`
5. Execute the query

This creates:
- `orders` table - Stores order data with payment info
- `order_items` table - Stores individual items in each order

### 3. Setup Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Email Configuration (for order confirmation emails)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

#### Getting Razorpay Credentials

1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate API Key
4. Copy your Key ID (starts with `rzp_live_` or `rzp_test_`)
5. Copy your Key Secret (keep it private!)

#### Email Configuration

Use any SMTP service:
- Gmail: `smtp.gmail.com` (enable App Password)
- SendGrid: `smtp.sendgrid.net`
- Mailgun: `smtp.mailgun.org`
- Your own SMTP server

### 4. Project Structure

New files created:

```
app/
├── api/
│   ├── orders/
│   │   └── create/route.ts          # Creates Razorpay order
│   ├── payments/
│   │   └── verify/route.ts          # Verifies payment signature
│   └── emails/
│       └── send-order/route.ts      # Sends order confirmation email
├── checkout/
│   └── page.tsx                     # Updated with Razorpay integration
└── order-success/
    └── [id]/page.tsx                # Order success page

lib/
├── supabase/
│   └── orders.ts                    # Order database operations

scripts/
└── 005_create_orders.sql            # Database migration
```

## Payment Flow

1. **User fills checkout form** with shipping details
2. **Create Order** → POST `/api/orders/create`
   - Creates Razorpay order
   - Returns order ID and payment details
3. **Razorpay Modal Opens** → User enters payment details
4. **Verify Payment** → POST `/api/payments/verify`
   - Verifies payment signature
   - Stores order in database
   - Clears user's cart
5. **Send Email** → POST `/api/emails/send-order`
   - Sends order confirmation email
   - Includes invoice details
6. **Redirect** → `/order-success/[orderId]`
   - Shows order confirmation page

## API Endpoints

### POST `/api/orders/create`
Creates a Razorpay order for checkout

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 XXXXX XXXXX",
  "address": "123 Main St",
  "city": "Mumbai",
  "zipCode": "400001"
}
```

**Response:**
```json
{
  "success": true,
  "razorpayOrderId": "order_XXXXX",
  "razorpayKeyId": "rzp_live_XXXXX",
  "amount": 5000,
  "currency": "INR",
  "cartData": { ... }
}
```

### POST `/api/payments/verify`
Verifies payment and creates order record

**Request:**
```json
{
  "razorpayOrderId": "order_XXXXX",
  "razorpayPaymentId": "pay_XXXXX",
  "razorpaySignature": "signature_hash",
  "fullName": "John Doe",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "uuid",
  "message": "Payment verified and order created successfully",
  "order": { ... }
}
```

### POST `/api/emails/send-order`
Sends order confirmation email

**Request:**
```json
{
  "orderId": "uuid",
  "orderNumber": "ORDER123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "totalAmount": 5000,
  "items": [...]
}
```

## Testing

### Test Mode (Sandbox)

Use Razorpay's test credentials:

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failed: `4222 2222 2222 2222`
- OTP: Any 6-digit number

Get test credentials from Razorpay Dashboard → Settings → API Keys (toggle to Test Mode)

### Test Email

To test email sending without actual SMTP:
1. Use Mailtrap (https://mailtrap.io) - Free SMTP service for testing
2. Copy SMTP credentials to `.env.local`
3. Check email in Mailtrap dashboard

## Database Schema

### orders table
```sql
- id (uuid) - Primary key
- user_id (uuid) - Foreign key to profiles
- razorpay_order_id (text) - Razorpay order ID
- razorpay_payment_id (text) - Razorpay payment ID
- razorpay_signature (text) - Payment signature
- total_amount (numeric) - Order total in INR
- status (text) - pending, success, failed
- full_name, email, phone, address, city, zip_code
- created_at, updated_at
```

### order_items table
```sql
- id (uuid) - Primary key
- order_id (uuid) - Foreign key to orders
- event_id (uuid) - Foreign key to events
- event_title (text) - Event name
- quantity (integer) - Item quantity
- unit_price (numeric) - Price per item
- total_price (numeric) - Quantity × unit_price
```

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep `RAZORPAY_KEY_SECRET` private - never expose to frontend
- Always verify payment signature on backend
- Use HTTPS in production
- Enable Razorpay webhook validation for additional security

## Webhook Setup (Optional)

For async order confirmations:

1. Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.authorized`, `payment.failed`
4. Create webhook route at `/app/api/webhooks/razorpay/route.ts`

## Troubleshooting

### Payment not working
- Verify Razorpay credentials in `.env.local`
- Check if Razorpay script loads: `https://checkout.razorpay.com/v1/checkout.js`
- Ensure HTTPS in production
- Check browser console for errors

### Email not sending
- Verify SMTP credentials
- Check spam/junk folder
- Use Mailtrap to test SMTP configuration
- Verify `SMTP_FROM_EMAIL` is valid

### Order not saving
- Verify Supabase migration ran successfully
- Check user authentication
- Verify `orders` and `order_items` tables exist
- Check Supabase logs for errors

### Signature verification fails
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Verify order ID and payment ID are correct
- Check timestamp (orders expire after 15 minutes)

## Next Steps

1. ✅ Install dependencies (`pnpm install`)
2. ✅ Set up environment variables
3. ✅ Run Supabase migration
4. ✅ Test with Razorpay test credentials
5. ⬜ Go live with production credentials
6. ⬜ Set up Razorpay webhooks (optional)
7. ⬜ Configure email templates further

## Support

- Razorpay Docs: https://razorpay.com/docs
- Razorpay Support: support@razorpay.com
- Next.js Docs: https://nextjs.org/docs
