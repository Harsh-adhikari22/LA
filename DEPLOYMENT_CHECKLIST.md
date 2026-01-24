# Razorpay Integration - Complete Checklist & Deployment Guide

## 📋 Pre-Deployment Checklist

### Environment & Setup
- [ ] Run `pnpm install` to install Razorpay SDK
- [ ] Have Razorpay account (https://razorpay.com)
- [ ] Have SMTP credentials for email (Gmail, SendGrid, etc.)
- [ ] Supabase project set up and accessible

### Database
- [ ] Run migration: `scripts/005_create_orders.sql` in Supabase
- [ ] Verify `orders` table created with 12 columns
- [ ] Verify `order_items` table created with 7 columns
- [ ] Verify indexes created (3 on orders, 1 on order_items)
- [ ] Test: Query `SELECT COUNT(*) FROM orders;` returns 0

### Environment Variables
- [ ] `.env.local` contains `RAZORPAY_KEY_ID` (test mode)
- [ ] `.env.local` contains `RAZORPAY_KEY_SECRET` (test mode)
- [ ] `.env.local` contains `SMTP_HOST`
- [ ] `.env.local` contains `SMTP_PORT` (usually 587)
- [ ] `.env.local` contains `SMTP_USER`
- [ ] `.env.local` contains `SMTP_PASSWORD` or `SMTP_TOKEN`
- [ ] `.env.local` contains `SMTP_FROM_EMAIL`
- [ ] `.env.local` is in `.gitignore` (not committed!)

### Code Review
- [ ] `/app/checkout/page.tsx` has Razorpay integration ✅
- [ ] `/app/api/orders/create/route.ts` exists ✅
- [ ] `/app/api/payments/verify/route.ts` exists ✅
- [ ] `/app/api/emails/send-order/route.ts` exists ✅
- [ ] `/app/order-success/[id]/page.tsx` exists ✅
- [ ] `/lib/supabase/orders.ts` exists ✅

---

## 🧪 Testing Phase (Local)

### Test 1: Basic Checkout Flow
```
1. Start: pnpm dev
2. Navigate: http://localhost:3000/events
3. Add event to cart
4. Go to: http://localhost:3000/cart
5. Click: "Proceed to Checkout"
6. Fill: All form fields (use test data)
7. Click: "Proceed to Payment"
8. Verify: Razorpay modal opens
```
- [ ] Modal appears without JavaScript errors
- [ ] Modal shows correct amount
- [ ] Customer name and email are prefilled

### Test 2: Successful Payment
```
1. In Razorpay modal:
   - Card: 4111 1111 1111 1111
   - Expiry: 12/25 (any future date)
   - CVV: 123 (any 3 digits)
   - OTP: 123456 (any 6 digits, if prompted)
2. Click: "Pay" or confirm
```
- [ ] Payment succeeds
- [ ] Redirect to `/order-success/[orderId]`
- [ ] Order details displayed correctly
- [ ] Order total matches cart total

### Test 3: Database Verification
```
Supabase SQL Editor:

SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```
- [ ] Order appears with correct user_id
- [ ] Status = "success"
- [ ] razorpay_payment_id is populated
- [ ] Total amount is correct

### Test 4: Order Items
```
Supabase SQL Editor:

SELECT * FROM order_items 
WHERE order_id = 'your_order_id';
```
- [ ] Item count matches cart items
- [ ] Event titles are correct
- [ ] Unit prices match
- [ ] Quantities are correct
- [ ] Total prices calculated correctly

### Test 5: Email Verification
- [ ] Check inbox (not spam!)
- [ ] Email subject: "Order Confirmation - Order #[NUMBER]"
- [ ] Email contains:
  - [ ] Order number
  - [ ] All items with quantities
  - [ ] Itemized price breakdown
  - [ ] Total amount
  - [ ] Customer name and address
  - [ ] "Payment Confirmed" badge

### Test 6: Cart Clearing
```
After successful payment:
1. Go back to: http://localhost:3000/cart
2. Verify: Cart is empty (shows "Your cart is empty")
```
- [ ] All items removed
- [ ] Cart shows 0 items

### Test 7: Failed Payment
```
1. Go through checkout again
2. Use test card: 4222 2222 2222 2222
3. Click pay
```
- [ ] Payment fails appropriately
- [ ] Error message shown
- [ ] Can try again
- [ ] Order NOT created in database

### Test 8: Authentication
```
1. Logout from your account
2. Try to access: http://localhost:3000/checkout directly
3. Try to access: http://localhost:3000/cart directly
```
- [ ] Redirected to login page
- [ ] Cannot access checkout without auth

### Test 9: Form Validation
```
In checkout:
1. Try to click "Proceed to Payment" with empty fields
```
- [ ] Error toast: "Please fill in all fields"
- [ ] No API call made
- [ ] Form stays on page

### Test 10: Edge Cases
- [ ] Empty cart → Shows "Cart is empty"
- [ ] Very large amount (₹999,999) → Works
- [ ] Special characters in name → Handled
- [ ] Long address → Formatted properly
- [ ] Phone number formats → Accepts various formats

---

## 🚀 Deployment to Production

### Step 1: Get Production Credentials

#### Razorpay
1. Log in to Razorpay Dashboard
2. Settings → API Keys
3. Click "Generate Key Pair" (Live Mode)
4. Copy:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

#### SMTP (Email)
Choose one:

**Option A: SendGrid**
- Sign up: https://sendgrid.com
- Get SMTP username: `apikey`
- Get SMTP password: API key from dashboard

**Option B: Mailgun**
- Sign up: https://mailgun.com
- Get SMTP host: `smtp.mailgun.org`
- Get SMTP user & password from account

**Option C: Gmail (Not recommended for production)**
- Enable 2FA
- Create App Password: https://myaccount.google.com/apppasswords
- SMTP: `smtp.gmail.com:587`
- User: your email
- Password: App password (16 chars)

### Step 2: Update Production Environment

In your production environment (e.g., Vercel, Railway):

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_here

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### Step 3: Update Email Templates (Optional)

Edit `/app/api/emails/send-order/route.ts`:
- Change footer email: `support@yourdomain.com`
- Change company name
- Add your logo URL
- Customize colors

### Step 4: Run Final Production Tests

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

- [ ] Build succeeds without errors
- [ ] All pages load
- [ ] Checkout works
- [ ] Payment processes
- [ ] Email sends

### Step 5: Deploy

Choose your platform:

**Vercel (Recommended):**
```bash
vercel --prod
```

**Railway, Netlify, etc:**
- Follow their deployment guides
- Set environment variables
- Ensure Node 18+

- [ ] Deployment successful
- [ ] Site is live
- [ ] HTTPS enabled
- [ ] No console errors

### Step 6: Post-Deployment Tests

```
1. Open live site
2. Complete full checkout flow
3. Verify order in production Supabase
4. Check production email inbox
5. Monitor for errors (24 hours)
```

- [ ] Real transaction successful
- [ ] Order in production database
- [ ] Email received
- [ ] No errors in logs

---

## 📊 Monitoring Checklist

### Daily
- [ ] Check failed payment count
- [ ] Check order count
- [ ] Verify emails are being sent
- [ ] Check error logs

### Weekly
- [ ] Review payment success rate
- [ ] Check email delivery rate
- [ ] Monitor database performance
- [ ] Look for unusual patterns

### Monthly
- [ ] Reconcile Razorpay payments vs orders
- [ ] Review customer feedback
- [ ] Check email bounce rate
- [ ] Optimize slow queries

---

## 🔒 Security Checklist

### Pre-Launch
- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local`
- [ ] Secret key is not in source code
- [ ] HTTPS enabled on production
- [ ] CORS configured correctly
- [ ] Rate limiting on payment endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified

### Post-Launch
- [ ] Monitor for suspicious payment patterns
- [ ] Set up fraud alerts in Razorpay
- [ ] Enable MFA on admin accounts
- [ ] Regular security updates
- [ ] Monitor for sensitive data leaks
- [ ] Backup database regularly

---

## 📞 Support Resources

### Razorpay
- Dashboard: https://dashboard.razorpay.com
- API Docs: https://razorpay.com/docs/api
- Support: support@razorpay.com
- Status: https://status.razorpay.com

### Email Issues
- SendGrid: https://app.sendgrid.com
- Mailgun: https://app.mailgun.com
- Gmail: https://myaccount.google.com

### Supabase
- Dashboard: https://supabase.com
- Docs: https://supabase.com/docs
- Support: https://supabase.com/docs/support

### Your Project
- GitHub: [Your repo]
- Production: [Your domain]
- Staging: [Your staging domain]

---

## 🆘 Emergency Troubleshooting

### Payment Gateway Down
1. Check Razorpay status: https://status.razorpay.com
2. If down: Show message "Payments temporarily unavailable"
3. Disable payment button in UI
4. Store cart data for later
5. Manual order processing fallback

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify SMTP port and security settings
3. Test with Mailtrap: https://mailtrap.io
4. Check email bounce rate
5. Whitelist domain if using corporate SMTP

### Database Connection Error
1. Check Supabase status: https://status.supabase.com
2. Verify database URL in `.env`
3. Check connection limit not exceeded
4. Restart application
5. Contact Supabase support if persists

### Order Verification Fails
1. Check `RAZORPAY_KEY_SECRET` matches live key
2. Verify timestamp not expired (15 min)
3. Check signature format
4. Review API logs
5. Manually verify in Razorpay dashboard

---

## 📈 Success Metrics

Track these KPIs:

- **Conversion Rate:** Orders / Checkouts Started
- **Payment Success Rate:** Successful / Total Attempts
- **Email Delivery Rate:** Delivered / Sent
- **Average Order Value:** Total Revenue / Orders
- **Failed Orders:** Monitor for spikes
- **Cart Abandonment:** Carts / Checkouts Initiated

---

## ✅ Final Sign-Off

Before declaring "Production Ready":

- [ ] All tests passed
- [ ] No console errors
- [ ] No database errors
- [ ] Email verified working
- [ ] Payment verified working
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Team trained on process
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

**Status:** Ready for deployment after completing all sections above.

**Next Step:** Start with testing phase if not already done.
