const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ✅ Function to Generate Invoice PDF
const generateInvoice = async (order, product) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");

    // ✅ Ensure the invoices directory exists
    if (!fs.existsSync(invoicesDir)) {
      try {
        fs.mkdirSync(invoicesDir, { recursive: true });
        console.log("✅ Created invoices directory.");
      } catch (err) {
        console.error("❌ Failed to create invoices directory:", err);
        return reject(err);
      }
    }

    const invoicePath = path.join(invoicesDir,`invoice_${order.id}.pdf`);
    console.log("📄 Generating Invoice at:", invoicePath);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(invoicePath);

    doc.pipe(stream);

    // ✅ Add Invoice Content
    doc.fontSize(20).text("Order Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order.unique_order_code}`);
    doc.text(`Product: ${product.name}`);
    doc.text(`Quantity: ${order.quantity}`);
    doc.text(`Total Price: ₹${order.total_price}`);
    doc.text(`Address: ${order.address}`);
    doc.text(`Status: ${order.status}`);
    doc.end();

    // ✅ Handle Stream Events
    stream.on("finish", () => {
      console.log("✅ Invoice successfully created:", invoicePath);
      resolve(invoicePath);
    });

    stream.on("error", (error) => {
      console.error("❌ Error generating invoice:", error);
      reject(error);
    });
  });
};



// ✅ Route Handler: Download Invoice
const getOrderInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📂 Fetching invoice for Order ID:", id); // ✅ Debug log

    // ✅ Ensure the file path is correct
    const invoicePath = path.join(__dirname, `../invoices/invoice_${id}.pdf`);
    console.log("🔍 Checking Invoice Path:", invoicePath);

    // ✅ Check if the file exists before sending
    if (!fs.existsSync(invoicePath)) {
      console.error("❌ Invoice file does not exist.");
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.download(invoicePath, `invoice_${id}.pdf`);
  } catch (error) {
    console.error("❌ Error retrieving invoice:", error);
    res.status(500).json({ message: "Failed to retrieve invoice." });
  }
};



// Configure Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Razorpay secret
});

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  const { total_price } = req.body;
  const amount = Math.round(total_price * 100);
  const currency = "INR";

  try {
    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay Payment and Send Email Notification
const verifyRazorpayPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    product_id,
    quantity,
    total_price,
    address,
  } = req.body;
  const user_id = req.user?.id;
  const user_email = req.user?.email;

  console.log("✅ Verifying Razorpay payment with data:", {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    product_id,
    quantity,
    total_price,
    address,
    user_id,
  });

  try {
    // 🔍 Step 1: Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 🔍 Step 2: Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔍 Step 3: Check stock availability
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // ✅ Step 4: Deduct stock
    product.quantity -= quantity;
    await product.save();

    // ✅ Step 5: Save order in the database
    const unique_order_code = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder = await Order.create({
      user_id,
      product_id,
      quantity,
      total_price,
      address,
      unique_order_code,
      status: "Completed",
    });

    console.log("✅ Order placed successfully:", newOrder);

    // ✅ Step 6: Generate PDF Invoice
    console.log("📄 Generating invoice for order...");
    const invoicePath = await generateInvoice(newOrder, product);
    console.log("✅ Invoice generated successfully at:", invoicePath);

    // Send Order Confirmation Email
    

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Order Confirmation - Shop Management System",
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your purchase!</p>
        <p><strong>Order ID:</strong> ${newOrder.unique_order_code}</p>
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total Price:</strong> ₹${total_price.toFixed(2)}</p>
        <p><strong>Delivery Address:</strong> ${address}</p>
        <p>Your order has been successfully placed. You can download your receipt from your orders page.</p>
        <br>
        <p>Shop Management System</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Payment verified, order placed, and email sent.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed.", error });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id; // Get logged-in user ID

    const orders = await Order.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ["name", "price", "image_url"] }], // Include product details
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get Order Status
const getOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status retrieved successfully",
      order_status: order.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve order status", error });
  }
};

// Update Order Status (Admin Only)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = order_status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderStatus,
  getOrderStatus,
  getUserOrders,
  getOrderInvoice,
  generateInvoice,
};
