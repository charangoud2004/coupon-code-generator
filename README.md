
# Coupon Code Generator

This is a **Full-Stack Web Application** developed as part of the Full-Stack Developer Internship assignment. The application distributes coupons to guest users in a round-robin manner and includes an admin panel for managing coupons and preventing abuse.

## Features

### User Side
- **Coupon Distribution**: Coupons are assigned sequentially to users without repetition.
- **Guest User Access**: Users can claim coupons without logging in.
- **Abuse Prevention**:
  - IP Tracking: Prevents multiple claims from the same IP within a cooldown period.
  - Cookie-Based Tracking: Restricts claims from the same browser session.
- **User Feedback**: Displays messages for successful claims or time restrictions.

### Admin Panel
- **Admin Login**: Secure access to admin functionality.
- **View Coupons**: Displays a list of all available and claimed coupons.
- **Add/Update Coupons**: Admins can upload new coupons or modify existing ones.
- **User Claim History**: Shows which users (IP/browser session) claimed coupons.
- **Toggle Coupon Availability**: Admins can enable/disable coupons dynamically.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas for cloud hosting)
- **Deployment**: Render
- **Other Tools**: Mongoose (for MongoDB), Dotenv (for environment variables)
  
---

## Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/charangoud2004/coupon-code-generator.git
cd coupon-code-generator
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file and configure it as follows:
```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

### Seed Initial Data
```sh
node seed.js
```

### Run the Server
```sh
npm start
```

## Live Demo

[🔗 Deployed App URL](https://coupon-code-generator.onrender.com/)

**Admin Credentials:**  
```
Username: admin  
Password: admin123  
```
