const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

// Admin login page
router.get("/login", (req, res) => {
  res.render("admin/login");
});

// Admin login form submission
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (for simplicity)
  if (username === "admin" && password === "admin123") {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Admin dashboard
router.get("/dashboard", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin/login");
  }

  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Items per page
    const skip = (page - 1) * limit;

    // Fetch total number of coupons
    const total = await Coupon.countDocuments({});
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated coupons
    const coupons = await Coupon.find({}).skip(skip).limit(limit);

    console.log("Current Page:", page); // Debugging
    console.log("Total Pages:", totalPages); // Debugging

    // Pass data to the template
    res.render("admin/dashboard", {
      coupons,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).send("Error fetching coupons");
  }
});

// Add new coupon
router.post("/add-coupon", (req, res) => {
  const { code } = req.body;

  const newCoupon = new Coupon({ code });
  newCoupon
    .save()
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((error) => {
      res.status(500).send("Error adding coupon");
    });
});

// Toggle coupon availability
router.post("/toggle-coupon/:id", (req, res) => {
  const { id } = req.params;

  Coupon.findById(id)
    .then((coupon) => {
      if (!coupon) return res.status(404).send("Coupon not found");

      // Toggle status
      coupon.status = coupon.status === "Available" ? "Claimed" : "Available";
      return coupon.save();
    })
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((error) => {
      res.status(500).send("Error toggling coupon");
    });
});

// Delete coupon
router.post("/delete-coupon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.redirect("/admin/dashboard"); // Redirect to dashboard after deletion
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).send("Error deleting coupon");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy the session
  res.redirect("/admin/login");
});

module.exports = router;
