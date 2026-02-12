# Chat App

A real-time chat application built with Node.js, Express, MongoDB, React, and Socket.io.

## Features

- User authentication (signup/login)
- Real-time messaging with Socket.io
- Online/offline user status
- Image sharing (via Cloudinary)
- Profile updates with avatar uploads
- Responsive UI with Tailwind CSS

## Project Structure

```
chat-app/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── lib/           # Utilities & helpers
│   │   └── index.js       # Server entry point
│   ├── .env           # Environment variables
│   └── package.json   # Dependencies
│
└── frontend/         # React/Vite frontend
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── context/         # React context (Auth, Chat)
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── .env           # Environment variables
    └── package.json   # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   - MongoDB connection string
   - JWT secret
   - Cloudinary API credentials

5. Start the development server:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Running the App

1. Start the backend server first:
   ```bash
   cd backend
   npm run dev
   ```

2. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status
- `PUT /api/auth/Update-profile` - Update user profile

### Messages
- `GET /api/message/users` - Get all users
- `GET /api/message/:id` - Get messages with user
- `POST /api/message/send/:id` - Send message

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, Cloudinary
- **Frontend**: React, Vite, React Router, React Hot Toast, Socket.io Client
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Image Upload**: Cloudinary
- **Real-time**: Socket.io for WebSocket communication

## Key Features Implementation

### Real-time Chat
- Socket.io connections track online users
- Messages are emitted in real-time to recipient
- Online/offline status indicators

### Authentication
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Protected routes with middleware

### User Management
- User profiles with avatars
- Cloudinary integration for image uploads
- List of available chat users

## Troubleshooting

- **Port already in use**: Change PORT in `.env` or kill the process using the port
- **MongoDB connection failed**: Check connection string and network access
- **CORS errors**: Ensure CLIENT_URL in backend .env matches frontend URL
- **Socket.io connection fails**: Verify backend is running and SOCKET_URL is correct

## Future Enhancements

- Typing indicators
- Message read receipts
- Group chats
- Message search
- File sharing (documents, videos)
- Voice/video calling
- Message reactions
- User status updates

---

Happy chatting! 🎉
