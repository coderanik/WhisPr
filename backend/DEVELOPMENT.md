# 🚀 WhisPr Backend Development Guide

This guide helps you set up and run the WhisPr backend locally for development.

## 🔧 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)
- Redis instance (local or Cloud)

## 📋 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/whispr
JWT_SECRET=your-dev-jwt-secret
SESSION_SECRET=your-dev-session-secret
ENCRYPTION_KEY=your-dev-encryption-key-32-chars
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas
- Use your Atlas connection string in `MONGO_URI`
- Ensure your IP is whitelisted

### 4. Redis Setup

#### Option A: Local Redis (Recommended for Development)
```bash
# Run the setup script
npm run setup-redis

# Check Redis status
npm run redis-status
```

#### Option B: Redis Cloud
- Set `NODE_ENV=production` to use Redis Cloud
- Or manually configure Redis connection

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### API Test
```bash
curl http://localhost:3001/
# Should return: "Backend is working"
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string format
- Check IP whitelist for Atlas

### Redis Connection Issues
- Ensure Redis server is running
- Check port 6379 is available
- Use `npm run redis-status` to test

### Build Issues
- Run `npm run build` to check TypeScript errors
- Ensure all dependencies are installed

## 🔄 Development Workflow

1. **Start Services**
   ```bash
   npm run setup-redis  # Start Redis
   npm run dev          # Start backend
   ```

2. **Make Changes**
   - Edit TypeScript files in `src/`
   - Server auto-restarts on changes

3. **Test Changes**
   - Check health endpoint
   - Test API endpoints
   - Monitor console logs

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/          # Database and Redis configuration
├── controllers/     # API route handlers
├── middlewares/     # Authentication and session middleware
├── models/          # Mongoose data models
├── routes/          # Express route definitions
├── utils/           # Utility functions and schedulers
├── startup.ts       # Application startup manager
└── server.ts        # Main server file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run setup-redis` - Setup and start local Redis
- `npm run redis-status` - Check Redis connection status

## 🔒 Security Notes

- Never commit `.env` files
- Use different secrets for development and production
- Keep dependencies updated
- Monitor for security vulnerabilities

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Redis Documentation](https://redis.io/documentation)
- [TypeScript Documentation](https://www.typescriptlang.org/)
