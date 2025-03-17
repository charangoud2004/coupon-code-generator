const abusePrevention = (req, res, next) => {
    const userIP = req.ip; // Get user's IP address
    const sessionID = req.session.id; // Get session ID
  
    // Check if the user has already claimed a coupon
    if (req.session.claimedCoupon) {
      return res.status(403).json({ message: 'You have already claimed a coupon. Please wait before claiming again.' });
    }
  
    // Mark the user as having claimed a coupon
    req.session.claimedCoupon = true;
  
    next(); // Proceed to the next middleware/route
  };
  
  module.exports = abusePrevention;