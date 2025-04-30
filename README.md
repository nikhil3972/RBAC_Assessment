## 📁 Project Structure
├── backend/             # Node.js + Express + MongoDB backend (API + Auth + Role Management)
├── frontend/            # React + React-Bootstrap frontend (Dashboard UI)


🚀 Prerequisites
Node.js (v16 or above)
MongoDB (local or Atlas cloud)
npm or yarn


🔧 Backend Setup
cd backend
npm install

📄 Create .env in backend/ with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=user_email
EMAIL_PASSWORD=app_password

📥 Seed Roles (Run once)
node seedRoles.js

▶️ Start Backend Server
npm start
Backend runs at: http://localhost:5000


💻 Frontend Setup
cd ../frontend
npm install
npm start
Frontend runs at: http://localhost:3000