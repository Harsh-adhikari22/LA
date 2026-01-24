import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface OrderItem {
  event_title: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderEmailData {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalAmount: number
  items: OrderItem[]
}

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

function generateOrderHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px; text-align: left;">${item.event_title}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">₹${item.unit_price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}</td>
      <td style="padding: 12px; text-align: right; font-weight: bold;">₹${item.total_price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}</td>
    </tr>
  `
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px;
        }
        .order-number {
          background-color: #f0f4ff;
          border-left: 4px solid #667eea;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .order-number p {
          margin: 5px 0;
          font-size: 14px;
        }
        .order-number strong {
          color: #667eea;
          font-size: 18px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-top: 25px;
          margin-bottom: 15px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }
        .customer-info, .shipping-info {
          font-size: 14px;
          line-height: 1.8;
        }
        .customer-info p, .shipping-info p {
          margin: 8px 0;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        .items-table thead {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        .items-table th {
          padding: 12px;
          text-align: left;
          border-bottom: 2px solid #667eea;
        }
        .items-table th:nth-child(2),
        .items-table th:nth-child(3),
        .items-table th:nth-child(4) {
          text-align: right;
        }
        .total-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .total-row.final {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
          padding-top: 10px;
          border-top: 2px solid #667eea;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 5px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 20px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <div class="order-number">
            <p>Order Number: <strong>${data.orderNumber}</strong></p>
            <p style="color: #667eea; font-weight: 600;">Payment Confirmed</p>
          </div>

          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Event/Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row final">
              <span>Total Amount</span>
              <span>₹${data.totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}</span>
            </div>
          </div>

          <div class="section-title">Delivery Details</div>
          <div class="shipping-info">
            <p><strong>${data.customerName}</strong></p>
            <p>${data.customerAddress}</p>
            <p>${data.customerCity}</p>
            <p>Phone: ${data.customerPhone}</p>
            <p>Email: ${data.customerEmail}</p>
          </div>

          <div class="section-title">What's Next?</div>
          <p style="font-size: 14px; line-height: 1.8;">
            We've received your order and will start processing it right away. 
            You'll receive updates about your order via email and SMS. 
            If you have any questions, please don't hesitate to contact us.
          </p>
        </div>

        <div class="footer">
          <p>Questions? Contact us at support@example.com or call +91-XXXX-XXXX</p>
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderEmailData = await request.json()

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: orderData.customerEmail,
      subject: `Order Confirmation - Order #${orderData.orderNumber}`,
      html: generateOrderHTML(orderData),
      text: `Order #${orderData.orderNumber} confirmed. Total: ₹${orderData.totalAmount}`,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Order confirmation email sent successfully",
    })
  } catch (error) {
    console.error("Error sending order email:", error)
    return NextResponse.json(
      { error: "Failed to send order email" },
      { status: 500 }
    )
  }
}
