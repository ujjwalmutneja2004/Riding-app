# 🛺 TravelX - The Smart Ride Booking App

**TravelX** is a real-time ride-booking web application built on the MERN stack, featuring animated transitions, real-time location tracking, and a seamless user experience. From booking to ride completion, every interaction is smooth, responsive, and intuitive.

---

## 🚀 Features

- 🔐 **JWT-based Authentication**
- 📍 **Location Search** with suggestions (TomTom API)
- 🧭 **GSAP-powered animated UI transitions**
- 🗺️ **Real-time location tracking**
- 👥 **Driver-Passenger matching**
- 💬 **Socket-based live ride updates**
- 💳 **Secure Payment Gateway Integration (Razorpay/Stripe)**
- 📧 **Automated Email Notifications**
  - Welcome email on sign-up
  - Ride start confirmation mail
  - Ride completion summary mail
- 🔐 Logout & Error handling
- 📱 Fully responsive mobile-friendly UI
- 🛠️ Admin Dashboard & Centralized Captain Management
  - Real-time monitoring of captains (drivers)
  - Ride tracking & activity insights
  - Centralized control for managing captain status, availability, and performance

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Frontend     | React.js, Tailwind CSS / Bootstrap, GSAP                                    |
| Backend      | Node.js, Express.js                                                         |
| Database     | MongoDB (Mongoose)                                                          |
| Real-Time    | Socket.IO                                                                   |
| Location API | TomTom Maps                                                                 |
| Payments     | Razorpay / Stripe                                                           |
| Email        | Nodemailer / SendGrid                                                       |
| Auth         | JWT (JSON Web Token)                                                        |
| Deployment   | Vercel (Frontend), Render / Railway (Backend)                               |

---

## 📦 Installation

### 🖥️ Prerequisites

- Node.js
- MongoDB
- TomTom API Key
- Razorpay/Stripe API Key
- Email provider credentials (Nodemailer / SendGrid)
- cloudinary

---

### 🔧 Install Dependencies

#### 🧠 Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
DB_CONNECT=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TOMTOM_API_KEY=your_tomtom_key
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword
SESSION_SECRE
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLOUDINARY_CLOUD_NAME
SECRET_KEY
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

#### 💻 Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `/frontend`:

```env
VITE_BASE_URL=your_vite_base_url(backend)
VITE_PUBLISH=your_vite_publish_key(Razarpaykey)
REACT_APP_TOMTOM_API_KEY=your_tomtom_key
```

---

## ▶️ Run Locally

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm start
```

Visit:  
🔗 `http://localhost:3000`

---

## 🧭 Ride Booking Flow

1. 🔎 **Search Panel** – Enter pickup & drop locations
2. 🚘 **Vehicle Panel** – Select vehicle type
3. ✅ **Confirm Ride** – Payment initiation and confirmation
4. ⌛ **Looking for Driver** – Searching...
5. 👨‍✈️ **Driver Found** – Display driver details
6. 🛣️ **Ride Started** – Track live ride
7. 🏁 **Ride Completed** – Fare shown and mail sent

All transitions handled using **GSAP** animations.

---

## 💸 Payment Gateway

- Payment initiated at ride confirmation step
- Razorpay/Stripe used for secure transactions
- Payment status updated in DB
- Can be extended to support wallets or UPI

---

## 📧 Email Notifications

- Welcome mail sent on sign-up
- Ride start mail with driver and pickup info
- Completion mail includes route and fare summary
- Built using **Nodemailer** or **SendGrid**

---



## 🧠 Future Enhancements

- 📞 Voice Calling between driver and passenger
- 🗺️ Live Driver Tracking on Map
- 📲 Progressive Web App (PWA) support
- 💰 Wallet-based payments and coupons
- 📩 Advanced mail customization with templates
- 🔔 Push Notifications (via Firebase or OneSignal)
- 📊 Admin Dashboard for trip analytics

---

## 🙌 Author

Made with ❤️ by [Ujjwal](https://github.com/ujjwalmutneja)

Special thanks to mentors, contributors, and the developer community.

---


