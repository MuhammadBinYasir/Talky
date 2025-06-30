# 🗨️ Talky

**Talky** is a dynamic, full-stack real-time chat platform that lets users connect, communicate, and collaborate. Built with modern technologies, Talky offers a secure and engaging social experience through messages, images, and audio — all in a responsive and user-friendly interface.

---

## 🧠 About the Project

Talky was built to offer a smooth, secure, and modern chatting experience where users can connect via friend requests and communicate using text, images, and audio. It simulates core social media features with a real-time messaging backend, designed for both mobile and desktop.


## 🚀 Features

- 🔐 **Authentication** – Secure user registration and login with session handling using supabase
- 🙋‍♂️ **Friend Requests** – Send, accept, or reject friend requests
- 💬 **Real-Time Chat** – Instant messaging powered by WebSockets (Socket.IO)
- 🖼️ **Media Messaging** – Share images and voice messages with friends
- 🟢 **Presence Indicators** – See online status and typing indicators
- 👤 **Profile Editing** – Users can edit their own profile and view others'
- 📬 **Request Inbox** – Easy management of incoming and sent friend requests
- 📱 **Fully Responsive** – Optimized for both mobile and desktop

## 🛠 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js, Express, Socket.IO  
- **Database:** MongoDB (with Mongoose)  
- **Authentication:** Supabase Authentication
- **Storage** Supabase Storage
- **Deployment:** (Add your hosting platform if any, e.g., Vercel / Render)

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MuhammadBinYasir/Talky.git
   cd Talky

2. **Install Dependencies For Client**

   ```bash
   cd client
   npm install

3. **Setup Environment Variables For Client**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=.O8SoPANSRqv10lIhf5ZU4gi77f5IL5Unk5VEcJN5xbc
   DATABASE_URL=""

5. **Run Client**
   ```bash
   npm run dev
4. **Install Dependencies For Server**

   ```bash
   cd server
   npm install

5. **Run Server**
   ```bash
   npm start

