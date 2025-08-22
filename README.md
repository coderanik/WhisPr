# WhisPr 🔒

A secure, anonymous messaging platform built with Next.js, Express.js, and MongoDB. WhisPr allows users to share messages anonymously while maintaining privacy and security.

## ✨ Features

- **Anonymous Messaging**: Share thoughts and messages without revealing your identity
- **Secure Authentication**: JWT-based authentication with session management
- **Rate Limiting**: Built-in protection against spam and abuse
- **Auto-Cleanup**: Messages are automatically cleaned up after 24 hours
- **Real-time Updates**: Modern React-based frontend with responsive design
- **Redis Sessions**: Fast and scalable session management
- **MongoDB Storage**: Reliable data persistence with Mongoose ODM

## 🏗️ Architecture

```
WhisPr/
├── frontend/          # Next.js 14 frontend application
├── backend/           # Express.js API server
└── README.md
```

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: React Context for authentication
- **Components**: Modular, reusable UI components
- **Routing**: App Router with dynamic pages

### Backend (Express.js)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose
- **Sessions**: Redis-based session storage
- **Authentication**: JWT + Session-based auth
- **Security**: Rate limiting, CORS, input validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Redis server
- npm or yarn

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/whispr

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=3001
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WhisPr
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📱 Usage

### Authentication
- **Register**: Create a new account with email and password
- **Login**: Sign in with your credentials
- **Logout**: Securely end your session

### Messaging
- **Create Messages**: Post anonymous messages to the forum
- **View Forum**: Browse all public messages
- **My Messages**: View your own message history
- **Rate Limiting**: Maximum 5 messages per minute per IP

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Messages
- `POST /api/messages/create` - Create a new message
- `GET /api/messages/forum` - Get all forum messages
- `GET /api/messages/my-messages` - Get user's messages
- `GET /api/messages/count` - Get message count

## 🛠️ Development

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Database Schema

#### User Model
```typescript
{
  name: string,
  email: string,
  password: string (hashed),
  createdAt: Date
}
```

#### Message Model
```typescript
{
  content: string,
  userId: ObjectId,
  createdAt: Date,
  expiresAt: Date (24 hours from creation)
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication tokens
- **Session Management**: Redis-based session storage
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Sanitized user inputs
- **Auto-cleanup**: Messages automatically expire after 24 hours

## 🧹 Maintenance

The system includes automated maintenance features:
- **Message Cleanup**: Automatic deletion of expired messages every 24 hours
- **Session Cleanup**: Redis session management with TTL
- **Database Optimization**: Efficient MongoDB queries and indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**coderanik** - [GitHub Profile](https://github.com/coderanik)

## 🙏 Acknowledgments

- Next.js team for the amazing React framework
- Express.js community for the robust backend framework
- MongoDB and Redis teams for excellent database solutions
- All contributors and users of this project

---

**Note**: This is a development project. For production use, ensure proper security measures, environment configuration, and deployment best practices are followed.
