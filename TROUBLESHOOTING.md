# Razorpay Integration - Troubleshooting Guide

## Common Issues & Solutions

---

## Payment Modal Issues

### ❌ "Razorpay is not defined" Error

**Symptom:** Browser console shows error when clicking payment button

**Solution:**
1. Check if script loads in Network tab (DevTools)
2. Clear browser cache: Ctrl+Shift+Delete
3. Hard refresh: Ctrl+F5
4. Check for JavaScript errors in console

**Root Cause:** Razorpay script (`checkout.js`) failed to load

```javascript
// Verify script is loading in useEffect:
useEffect(() => {
  const script = document.createElement("script")
  script.src = "https://checkout.razorpay.com/v1/checkout.js"
  script.async = true
  script.onload = () => console.log("Razorpay script loaded")
  script.onerror = () => console.error("Failed to load Razorpay")
  document.body.appendChild(script)
}, [])
```

---

### ❌ Modal Won't Open

**Symptom:** Payment button doesn't open Razorpay modal

**Solution:**
1. Check browser console for errors
2. Verify `/api/orders/create` returns valid response:
   ```
   DevTools → Network → XHR/Fetch → Check /api/orders/create
   ```
3. Ensure Razorpay key starts with `rzp_test_` or `rzp_live_`
4. Check if amount is > 0

**Debug Steps:**
```javascript
// Add console logs in handlePayment
const orderResponse = await fetch("/api/orders/create", {...})
console.log("Order response:", orderResponse)
const orderData = await orderResponse.json()
console.log("Order data:", orderData)
// Check if razorpayOrderId exists
```

---

### ❌ Payment Modal Closes Immediately

**Symptom:** Modal opens then closes without user action

**Solution:**
1. Check `.env.local` for correct `RAZORPAY_KEY_ID`
2. Verify key ID format: should start with `rzp_`
3. Check if using test vs live credentials correctly
4. Verify order amount is valid (1 to 100000000 paise)

---

## Authentication Issues

### ❌ Redirected to Login on Checkout

**Symptom:** Clicking checkout redirects to `/auth/login`

**Solution:**
1. Verify you're logged in: Check navbar
2. Login again: Go to `/auth/login`
3. Check browser cookies: DevTools → Application → Cookies
4. Verify Supabase auth is configured

**Debug:**
```javascript
// In checkout page:
const { data: { user } } = await supabase.auth.getUser()
console.log("Current user:", user)
```

---

### ❌ Order Shows Wrong User

**Symptom:** Order created but shows different user_id

**Solution:**
1. Check multiple tabs aren't open with different users
2. Clear cookies and re-login
3. Verify user_id in database matches your account
4. Check order ownership in order-success page

---

## API Issues

### ❌ `/api/orders/create` Returns 400 Error

**Symptom:** Error creating order on checkout

**Possible Causes:**

**Missing Fields:**
```
Error: "Missing required fields"
Solution: Fill in ALL form fields before clicking payment
```

**Empty Cart:**
```
Error: "Cart is empty"
Solution: Add items to cart first
```

**User Not Authenticated:**
```
Error: "Unauthorized"
Solution: Login first
```

---

### ❌ `/api/payments/verify` Returns 400 Error

**Symptom:** Payment verification fails after successful Razorpay payment

**Possible Causes:**

**Invalid Signature:**
```
Error: "Invalid payment signature"
Root cause: RAZORPAY_KEY_SECRET is incorrect or has spaces
Solution: 
1. Copy key from Razorpay dashboard again
2. Ensure no extra spaces in .env.local
3. Restart dev server (pnpm dev)
```

**Empty Cart During Verification:**
```
Error: "Cart is empty"
Solution: Don't clear cart manually, let API handle it
```

---

### ❌ `/api/emails/send-order` Returns 500 Error

**Symptom:** Payment successful but email not sent

**Check SMTP Configuration:**

```env
# Verify these exist in .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # NOT regular password!
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.com
```

**Test Email with Mailtrap:**
1. Go to https://mailtrap.io (free account)
2. Create inbox
3. Copy SMTP credentials
4. Replace values in `.env.local`
5. Restart server
6. Test checkout
7. Check Mailtrap dashboard for email

**Common Email Issues:**
- Gmail App Password: Must be 16 characters
- SendGrid: User must be `apikey`
- Port: Usually 587 (not 25 or 465)
- SECURE: `false` for port 587

---

## Database Issues

### ❌ Order Not Appearing in Database

**Symptom:** Payment succeeded but no order in Supabase

**Solution:**

1. **Verify Migration Ran:**
   ```sql
   SELECT * FROM orders LIMIT 1;
   ```
   If error: "table does not exist" → Run migration

2. **Check User ID:**
   ```sql
   SELECT * FROM profiles WHERE id = 'your-user-id';
   ```
   If no result: User profile not created

3. **Check Order Status:**
   ```sql
   SELECT * FROM orders 
   WHERE status = 'pending' 
   ORDER BY created_at DESC;
   ```
   If shows pending: Payment verification didn't complete

4. **Check Logs:**
   In Supabase dashboard → Logs → Check for errors

---

### ❌ Cannot Create Order - Foreign Key Error

**Symptom:** Error "violates foreign key constraint"

**Solution:**
1. Verify user profile exists in `profiles` table
2. Ensure `user_id` matches exactly
3. Don't manually delete profiles without orders

**Check:**
```sql
SELECT u.id, p.id FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id 
WHERE u.id = 'your-user-id';
```

---

### ❌ Order Items Not Saving

**Symptom:** Order created but no items

**Solution:**
1. Verify cart has items before payment
2. Check `order_items` table:
   ```sql
   SELECT * FROM order_items 
   WHERE order_id = 'order-id';
   ```
3. Check for item insert errors in logs

---

## Email Issues

### ❌ Email Not Received

**Symptom:** Order confirmed but no email in inbox

**Solution:**

1. **Check Spam Folder:**
   - Often first email goes to spam
   - Mark as "Not Spam" to fix sender

2. **Verify Email Sent:**
   ```sql
   SELECT * FROM orders 
   WHERE email = 'your-email@example.com' 
   ORDER BY created_at DESC LIMIT 1;
   ```

3. **Test with Mailtrap:**
   - Easier to debug
   - All emails go to dashboard
   - Test SMTP configuration

4. **Check SMTP Logs:**
   - Gmail: https://myaccount.google.com/security
   - SendGrid: https://app.sendgrid.com/logs

5. **Verify From Address:**
   ```env
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```
   Some providers require verified sender address

---

### ❌ Email Shows "Unsubscribe" or "Report Spam"

**Symptom:** Email looks unprofessional

**Solution:**
1. Add unsubscribe header (optional but recommended)
2. Update footer with company contact
3. Use professional template
4. Verify domain DKIM/SPF records

---

### ❌ Wrong Company Name in Email

**Symptom:** Email shows generic text

**Solution:**
Edit `/app/api/emails/send-order/route.ts`:
```javascript
// Find this section:
<div class="footer">
  <p>Questions? Contact us at support@yourdomain.com</p>
  <p>&copy; 2024 YOUR COMPANY NAME. All rights reserved.</p>
</div>
```

Update with your company details

---

## Frontend Issues

### ❌ Form Won't Submit

**Symptom:** Payment button grayed out or unresponsive

**Solution:**
1. Fill ALL required fields:
   - Full Name
   - Email
   - Phone
   - Address
   - City
   - ZIP Code

2. Check console for validation errors

3. Verify cart isn't empty

---

### ❌ Toast Notifications Not Showing

**Symptom:** No feedback when clicking payment

**Solution:**
1. Check if Toaster component is in layout
2. Verify `useToast()` hook is imported correctly
3. Check toast CSS is loaded

---

### ❌ Form Data Not Preserved

**Symptom:** Form resets after payment error

**Solution:**
This is intentional for security. Users need to refill form for retry.

To change, modify checkout component:
```javascript
// Don't clear formData on error
// Remove: setFormData({...})
```

---

## Production Issues

### ❌ Payment Works in Dev but Not in Production

**Symptom:** Test works locally, fails on live site

**Solution:**

1. **Check Environment Variables:**
   ```
   Production should have:
   - RAZORPAY_KEY_ID=rzp_live_xxxxx (not rzp_test_)
   - RAZORPAY_KEY_SECRET=correct_secret
   - Verify no extra spaces or quotes
   ```

2. **Check HTTPS:**
   Razorpay requires HTTPS in production
   ```
   ❌ http://yourdomain.com (won't work)
   ✅ https://yourdomain.com (works)
   ```

3. **Check Domain:**
   Razorpay verifies domain in live mode
   - Go to Razorpay Dashboard
   - Settings → Websites → Add your domain

4. **Check CSP Headers:**
   ```
   Some hosting blocks Razorpay scripts
   Whitelist: https://checkout.razorpay.com
   ```

---

### ❌ Real Card Rejected in Production

**Symptom:** Live card fails even though test card worked

**Solution:**
1. This might be Razorpay security (test phase)
2. Email Razorpay support: support@razorpay.com
3. Contact your bank - card might be blocked
4. Try different card
5. Check if limits exceeded

---

## Database Performance Issues

### ❌ Order Page Loads Slowly

**Symptom:** `/order-success/[id]` takes too long

**Solution:**
1. Check database indexes:
   ```sql
   SELECT * FROM pg_indexes 
   WHERE tablename = 'orders';
   ```

2. If indexes missing, re-run migration

3. Check query performance:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM orders 
   WHERE id = 'order-id';
   ```

---

## Testing Issues

### ❌ Can't Create Test Payment

**Symptom:** "Order does not exist" on test card

**Solution:**
1. Verify test mode is ON in Razorpay:
   Dashboard → Settings → Toggle "Test Mode"

2. Use only test cards in test mode:
   - Success: 4111 1111 1111 1111
   - Fail: 4222 2222 2222 2222

3. Don't mix test and live keys

---

## Getting Help

### Debug Checklist

Before reporting issue, verify:

- [ ] Environment variables are set correctly
- [ ] No extra spaces in `.env.local`
- [ ] Browser console has no errors
- [ ] Network tab shows API responses
- [ ] Database migration ran successfully
- [ ] Test data exists in cart
- [ ] User is authenticated
- [ ] SMTP configuration is correct

### Gathering Information for Support

If you need help, provide:

1. **Error Message:** Copy full error text
2. **Steps to Reproduce:** Exact steps that trigger issue
3. **Environment:** Test or Production?
4. **Logs:** Browser console → right-click → Save as
5. **Screenshots:** Visual evidence of issue

### Support Resources

- **Razorpay:** support@razorpay.com
- **SMTP Issues:** Contact your email provider
- **Supabase:** https://supabase.com/support
- **Next.js:** https://nextjs.org/docs

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| No modal | Check Razorpay script loaded |
| Payment fails | Verify RAZORPAY_KEY_SECRET |
| No email | Check SMTP credentials |
| No order | Verify migration ran |
| Auth issues | Login again, clear cookies |
| Form won't submit | Fill all fields |
| Slow page | Check database indexes |

---

**Last Updated:** 2024-01-25
**Status:** Comprehensive troubleshooting guide
