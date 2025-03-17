const express = require('express');
const session = require('express-session');
const connectDB = require('./init/db'); // Import database connection
const Coupon = require('./models/Coupon');
const abusePrevention = require('./utils/abusePrevention');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config(); // Load environment variables

const app = express();

//  Connect to MongoDB before starting the server
connectDB();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Apply abuse prevention middleware to the coupon claim route
app.use('/claim-coupon', abusePrevention);

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Claim coupon API
app.set('trust proxy', true); // Trust proxy to get real IP

app.get('/claim-coupon', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const nextCoupon = await Coupon.findOne({ status: 'Available' }).sort({ _id: 1 });
    if (!nextCoupon) return res.status(404).json({ message: 'No coupons left' });

    nextCoupon.status = 'Claimed';
    nextCoupon.claimedBy = clientIp; // Save the correct IP
    nextCoupon.claimedAt = new Date();
    await nextCoupon.save();

    res.json({ message: 'Coupon claimed!', coupon: nextCoupon.code });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Use admin routes
app.use('/admin', adminRoutes);

// Start the server after DB connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
