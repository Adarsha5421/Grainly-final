# 🌱 Grainly: Where Nature Meets Technology

> *From farm to table, we're reimagining how you discover and enjoy the world's finest pulses*

---

![Live Status](https://img.shields.io/badge/Status-Live-brightgreen)
![React Version](https://img.shields.io/badge/React-18.3.1-blue)
![Backend Stack](https://img.shields.io/badge/Node.js-Express-brightgreen)
![Database](https://img.shields.io/badge/MongoDB-8.16.1-green)

## 🎯 What We're Building

Imagine a world where premium pulses aren't just ingredients—they're stories waiting to be told. Grainly isn't your typical e-commerce platform; we're crafting an experience that connects you directly with the earth's finest legumes, from the moment they're harvested to when they grace your kitchen.

### ✨ The Magic We've Woven

| **Shopping Experience** | **User Journey** | **Behind the Scenes** |
|------------------------|------------------|----------------------|
| 🛍️ **Curated Catalog** | Browse handpicked pulses with rich details | Real-time inventory tracking |
| 🛒 **Smart Cart** | Add/remove items with intuitive controls | Seamless quantity management |
| 🔐 **Secure Identity** | Login/register with bulletproof security | JWT tokens with military-grade encryption |
| 📦 **Order Tracking** | Watch your order's journey from farm to door | Complete lifecycle management |
| 👑 **Admin Powerhouse** | Manage products, orders, and users effortlessly | Comprehensive control panel |
| 📱 **Mobile-First** | Beautiful on every device | Tailwind CSS magic |

---

## 🛠️ The Tech Symphony

### **Frontend Orchestra**
- **React 18.3.1** — The conductor of our UI symphony
- **Vite** — Lightning-fast build tool that never sleeps
- **Tailwind CSS** — Utility-first styling that just works
- **React Router DOM** — Seamless navigation without page reloads
- **Axios** — HTTP client that speaks your language
- **React Hot Toast** — Notifications that feel alive
- **React Icons** — Visual language that speaks volumes
- **Framer Motion** — Animations that dance across your screen

### **Backend Ensemble**
- **Node.js** — The JavaScript runtime that powers everything
- **Express.js** — Web framework that handles requests like a pro
- **MongoDB** — NoSQL database that scales with your dreams
- **Mongoose** — MongoDB object modeling that just makes sense
- **JWT** — JSON Web Tokens for secure authentication
- **bcryptjs** — Password hashing that's bulletproof
- **Multer** — File upload middleware that handles anything
- **CORS** — Cross-origin resource sharing security

---

## 📁 How We've Organized the Chaos

```
🌱 Grainly/
├── 🎨 Frontend/                    # Where the magic happens
│   ├── src/
│   │   ├── components/            # Building blocks of beauty
│   │   │   ├── admin/            # Admin dashboard wizardry
│   │   │   ├── allproducts/      # Product catalog showcase
│   │   │   ├── cart/             # Shopping cart experience
│   │   │   ├── contact/          # Customer connection hub
│   │   │   ├── Footer/           # Site footer with personality
│   │   │   ├── Hero/             # Landing page hero section
│   │   │   ├── home/             # Homepage that welcomes
│   │   │   ├── login/            # Secure authentication
│   │   │   ├── Navbar/           # Navigation that guides
│   │   │   ├── productdetails/   # Product deep-dive pages
│   │   │   └── register/         # User onboarding
│   │   ├── context/              # State management magic
│   │   ├── api/                  # API communication layer
│   │   └── assets/               # Images and static treasures
│   └── package.json
├── ⚙️ Backend/                    # The engine room
│   ├── config/                   # Database configuration
│   ├── controllers/              # Business logic handlers
│   ├── middleware/               # Custom request processors
│   ├── models/                   # MongoDB schema definitions
│   ├── routes/                   # API endpoint definitions
│   ├── uploads/                  # Product image storage
│   └── server.js                # Main server orchestrator
└── 📖 README.md
```

---

## 🚀 Let's Get This Party Started

### **What You'll Need**
- **Node.js** (v16 or higher) — The foundation
- **MongoDB** (local or cloud) — The data store
- **npm** or **yarn** — Package management

### **Step 1: Clone the Adventure**
```bash
git clone <repository-url>
cd grainly
```

### **Step 2: Backend Setup (The Foundation)**
```bash
cd Backend

# Install the dependencies
npm install

# Create your environment file
cp .env.example .env
```

**Configure your `.env` file with these secrets:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**Fire up the backend server:**
```bash
npm start
# Your server will be dancing at http://localhost:5000
```

### **Step 3: Frontend Setup (The Beauty)**
```bash
cd Frontend

# Install the frontend dependencies
npm install

# Start the development server
npm run dev
# Your frontend will be shining at http://localhost:5173
```

### **Step 4: Database Setup (The Brain)**
- Make sure MongoDB is running smoothly
- The application will automatically create collections
- If you need an admin user, run: `node seedAdmin.js`

---

## 🎯 How to Use This Beautiful Beast

### **For Our Valued Customers**
1. **Explore the Bounty** — Visit the homepage to discover our finest pulses
2. **Join the Family** — Register for an account or login to your existing one
3. **Build Your Cart** — Click "Add to Cart" on any product that catches your eye
4. **Manage Your Selection** — View cart, adjust quantities, remove items as needed
5. **Complete Your Journey** — Checkout with shipping details and payment
6. **Track Your Treasure** — View order history in your personal profile

### **For Our Admin Heroes**
1. **Access the Command Center** — Login to admin dashboard at `/admin`
2. **Manage the Inventory** — Add, edit, or remove products with ease
3. **Oversee Orders** — View and update order status in real-time
4. **Monitor Users** — Keep an eye on user accounts and activity
5. **Analyze Performance** — View sales metrics and insights

---

## 🔧 API Endpoints (The Communication Channels)

### **Authentication (Who You Are)**
- `POST /api/auth/register` — Join the Grainly family
- `POST /api/auth/login` — Welcome back, friend
- `GET /api/auth/profile` — Your personal information

### **Products (What We Offer)**
- `GET /api/pulses` — Browse our complete collection
- `GET /api/pulses/:id` — Dive deep into a specific product
- `POST /api/pulses` — Add new products (admin only)
- `PUT /api/pulses/:id` — Update product details (admin only)
- `DELETE /api/pulses/:id` — Remove products (admin only)

### **Orders (Your Journey)**
- `POST /api/bookings` — Create your order
- `GET /api/bookings` — View your order history
- `GET /api/bookings/admin` — Admin view of all orders

### **Contact (Let's Talk)**
- `POST /api/contact` — Send us a message

---

## 🎨 The Building Blocks That Make It Beautiful

### **Frontend Components (The User Experience)**
- **Navbar** — Responsive navigation that guides your journey
- **Hero Section** — Captivating landing page that tells our story
- **Product Cards** — Beautiful product displays with smart add-to-cart
- **Shopping Cart** — Real-time cart management that feels alive
- **Admin Dashboard** — Complete admin interface for power users
- **Footer** — Contact information and social connections

### **Backend Features (The Muscle)**
- **User Authentication** — JWT-based security that never sleeps
- **Product Management** — CRUD operations that handle anything
- **Order Processing** — Complete order lifecycle management
- **File Upload** — Product image management that scales
- **Error Handling** — Comprehensive error responses that help

---

## 🔒 Security That Never Sleeps

- **JWT Authentication** — Secure token-based authentication
- **Password Hashing** — bcryptjs for bulletproof password security
- **CORS Protection** — Cross-origin request security
- **Input Validation** — Server-side data validation
- **Error Handling** — Secure error responses

---

## 📱 Responsive Design (Looks Great Everywhere)

Our application dances beautifully across all devices:
- **Mobile-first approach** — Designed for your phone first
- **Tailwind CSS utilities** — Consistent styling everywhere
- **Flexible grid layouts** — Adapts to any screen size
- **Touch-friendly interfaces** — Perfect for mobile interaction
- **Optimized for all screens** — From phone to desktop

---

## 🚀 Deployment (Taking It Live)

### **Frontend Deployment (Vercel/Netlify)**
```bash
cd Frontend
npm run build
# Deploy the dist folder to your preferred platform
```

### **Backend Deployment (Heroku/Railway)**
```bash
cd Backend
# Set your environment variables
# Deploy to your chosen platform
```

---

## 🤝 Contributing (Join the Family)

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License (The Legal Stuff)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 The Dream Team

- **Frontend Developer** — React, Tailwind CSS, Vite wizard
- **Backend Developer** — Node.js, Express, MongoDB maestro
- **UI/UX Designer** — Modern, responsive design artist

---

## 📞 Support (We're Here for You)

For support and questions:
- **Email**: support@grainlypulses.com
- **Website**: [Grainly](https://grainlypulses.com)
- **Contact Form**: Available right on our website

---

> **Made with ❤️ for premium pulses lovers everywhere**

*Experience the finest hand-picked pulses delivered from the best farms to your kitchen — the Grainly way.* 