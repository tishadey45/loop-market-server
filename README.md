# 🔄 Loop Market

Loop Market is a modern, fast, and secure pre-loved re-commerce marketplace designed to give products a second life. It connects trusted buyers and sellers locally, promoting sustainable consumption by making the buying and selling of used items smooth and efficient.

## 🔗 Live & Repository Links

- **🌐 Live Site URL:** [https://loop-market-ten.vercel.app](https://loop-market-ten.vercel.app)
- **💻 Client Repository:** [https://github.com/tishadey45/loop-market-client](https://github.com/tishadey45/loop-market-client)
- **🖥️ Server Repository:** [https://github.com/tishadey45/loop-market-server](https://github.com/tishadey45/loop-market-server)

---

## 🎯 Project Purpose

The primary goal of **Loop Market** is to create a trusted ecosystem for buying and selling secondhand or pre-loved goods. It bridges the gap between individual sellers and bargain-hunting buyers, minimizing waste while providing an interactive platform complete with full user management, dynamic product moderation, and order booking capabilities.

---

## ✨ Key Features

- **🔐 Next-Gen Authentication:** Integrated with **Better Auth** for multi-layered security and smooth session persistence on the client-side.
- **🛡️ Comprehensive Admin Moderation:** Dedicated Admin Panel to oversee all users, change platform roles (Buyer/Seller/Admin), toggle account blocks, and delete fraudulent or flagged listings instantly.
- **📦 Dynamic Product Management:** Sellers can easily list, monitor stock status (`available` / `sold out`), edit product parameters in-app, or remove listings with real-time UI synchronization.
- **🛒 Seamless Order & Booking:** One-click booking engine for buyers that logs the order, saves transaction statuses, and updates available quantities concurrently.
- **⚡ Interactive Search & Filters:** Fast client-side algorithmic search targeting product titles and category boundaries instantly without jarring page reloads.
- **🎨 Premium Visual Experience:** Powered by **Tailwind CSS** and **DaisyUI**, featuring fully custom popups using **SweetAlert2** and micro-notifications via **react-hot-toast**.

---

## 🛠️ NPM Packages Used

### Client-Side (Frontend)
- `next` (Next.js App Router Framework)
- `react` / `react-dom`
- `better-auth` (Authentication Engine Client)
- `axios` (Secure API Orchestration)
- `lucide-react` (Modern UI Icon Architecture)
- `sweetalert2` (Custom Moderation Popups)
- `react-hot-toast` (Real-time Feedback Notifications)
- `tailwindcss` / `daisyui` (UI Theme System)

### Server-Side (Backend)
- `express` (Minimalist Server Framework)
- `mongodb` (Native Database Adapter)
- `cors` (Cross-Origin Resource Sharing)
- `dotenv` (Environment Variables Isolation)

---

## 👥 Demo Admin Credentials

For evaluation and testing purposes, you can log into the platform with the following administrative credentials to gain access to the User Control and Product Moderation dashboards:

- **📧 Admin Email:** `pk@gmail.com`
- **🔑 Admin Password:** `Pa$$w0rd!`

---

## 🚀 Local Installation Guide

1. **Clone the project repository:**
   ```bash
   git clone [https://github.com/tishadey45/loop-market-client.git](https://github.com/tishadey45/loop-market-client.git)

```

2. **Navigate into the directory and install dependencies:**
```bash
cd loop-market-client
npm install

```


3. **Configure Environment Variables (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_auth_secret_here

```


4. **Run the development workspace:**
```bash
npm run dev

```