# Quick Start: Razorpay Integration

Get Razorpay payments working in 5 minutes.

## Step 1: Install Dependencies (1 min)

```bash
cd /Users/harshadhikari22/LA
pnpm install
```

## Step 2: Get Razorpay Credentials (2 min)

1. Sign up at https://razorpay.com (or log in)
2. Go to **Dashboard → Settings → API Keys**
3. Toggle to **Test Mode** (for testing)
4. Click "Generate Key Pair"
5. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

## Step 3: Add Environment Variables (1 min)

Create/edit `.env.local` file in project root:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_here
```

⚠️ **Note:** Verify these email variables are also set:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.com
```

## Step 4: Run Database Migration (1 min)

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **SQL Editor → New Query**
4. Open file: `scripts/005_create_orders.sql`
5. Copy entire content
6. Paste into Supabase SQL Editor
7. Click **Run** (or Ctrl+Enter)

✅ Should see: "Query executed successfully"

## Step 5: Test the Checkout (no extra time needed!)

1. Start dev server:
```bash
pnpm dev
```

2. In your browser:
   - Go to http://localhost:3000
   - Add event to cart
   - Go to `/cart`
   - Click "Proceed to Checkout"
   - Fill form details
   - Click "Proceed to Payment"

3. Razorpay modal opens - use test card:
   - **Card:** 4111 1111 1111 1111
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVV:** Any 3 digits (e.g., 123)
   - **OTP:** Any 6 digits

4. ✅ Payment succeeds!
5. ✅ Order created in Supabase
6. ✅ Email sent
7. ✅ Redirected to success page

## Verify It Worked

### Check Order in Supabase
1. Supabase Dashboard → SQL Editor
2. Run this query:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```
✅ Should see your order

### Check Email
- Check your inbox (or Spam)
- Look for "Order Confirmation" email
- ✅ Should have order details, items, and total

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Razorpay is not defined" | Script didn't load - check network tab, clear cache |
| Signature verification failed | Check `RAZORPAY_KEY_SECRET` is correct (no spaces) |
| Email not received | Check .env SMTP settings, try Mailtrap |
| Order not in DB | Check browser console for errors, verify auth |
| Payment modal won't open | Open browser DevTools → Console for JS errors |

## Common Test Scenarios

### Successful Payment
- Card: `4111 1111 1111 1111`
- Any future expiry & CVV
- ✅ Payment succeeds, order created

### Failed Payment
- Card: `4222 2222 2222 2222`
- Any future expiry & CVV
- ❌ Payment fails (test error handling)

### 3D Secure / OTP
- Most test cards ask for OTP
- Enter any 6 digits
- Completes payment

## Going Live (When Ready)

When you want real payments:

1. **Switch Razorpay to Live Mode:**
   - Dashboard → Settings → API Keys
   - Toggle OFF "Test Mode"
   - Get new Key ID & Secret

2. **Update `.env.local`:**
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret
```

3. **Use Real SMTP:**
```env
SMTP_HOST=smtp.sendgrid.net  # or your provider
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxx...
```

4. **Deploy to production**

5. **Test with small real transaction** (₹1-10)

6. **Monitor for errors**

## Files You Changed

```
✅ package.json                           (razorpay added)
✅ scripts/005_create_orders.sql          (new database)
✅ app/checkout/page.tsx                  (Razorpay integrated)
✅ lib/supabase/orders.ts                 (new)
✅ app/api/orders/create/route.ts         (new)
✅ app/api/payments/verify/route.ts       (new)
✅ app/api/emails/send-order/route.ts     (new)
✅ app/order-success/[id]/page.tsx        (new)
```

## What Happens Behind The Scenes

```
User pays on checkout
    ↓
Creates Razorpay order
    ↓
Opens payment modal
    ↓
User enters card details
    ↓
Razorpay processes payment
    ↓
Verifies signature on your server
    ↓
Saves order to database
    ↓
Clears cart
    ↓
Sends confirmation email
    ↓
Shows success page
```

## Next: Advanced Setup

Once working, optionally set up:
- Webhooks for async confirmations: `RAZORPAY_SETUP.md`
- Refunds: Supabase function + Razorpay API
- Subscriptions: Razorpay Plans API
- Invoice generation: Add PDF library

## Support

- 📧 Email: support@razorpay.com
- 📚 Docs: https://razorpay.com/docs
- 💬 Chat: In Razorpay Dashboard → Help
- 🐛 Issues: Check browser console & Supabase logs

---

**You're all set!** Start with test credentials, then go live when ready. 🚀
