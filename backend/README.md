# Whispr Backend API

A secure, anonymous messaging platform backend built with Node.js, Express, and MongoDB.

## 🔐 Authentication System

### Anonymous User Registration
- Users register using only their **registration number (regNo)** and **password**
- No personal names or identifying information are collected
- System automatically generates a unique **anonymous name** for each user
- The same registration number always generates the same anonymous name
- Anonymous names are hidden from developers and administrators

### Login Process
- Users login using their **registration number** and **password**
- No need to remember or enter the anonymous name
- System authenticates based on the stored credentials
- JWT tokens are issued for session management

### Security Features
- Registration numbers are validated against allowed ranges
- Passwords and registration numbers are securely hashed using bcrypt
- Rate limiting prevents brute force attacks
- Session-based authentication with JWT fallback
- Anonymous names are cryptographically generated and consistent

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- Redis (for session storage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up Redis:
   ```bash
   npm run setup-redis
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register with regNo and password
- `POST /api/auth/login` - Login with regNo and password
- `POST /api/auth/logout` - Logout and clear session

### Messages
- `GET /api/messages/forum` - Get public forum messages
- `POST /api/messages/create` - Create a new message (authenticated)
- `GET /api/messages/user` - Get user's own messages (authenticated)
- `GET /api/messages/count` - Get message count for rate limiting (authenticated)

## 🧪 Testing

Run the test suite to verify the authentication system:

```bash
# Test the anonymous authentication system
node test-anonymous-auth.js

# Test the message API
node test-messages.js
```

## 🔧 Configuration

### Registration Range
The system validates registration numbers against a predefined range:
```typescript
const REGISTRATION_RANGE = {
  min: 2411033010001,
  max: 2411033010057,
};
```

### Anonymous Name Generation
Anonymous names are generated using a combination of:
- Adjectives (e.g., Mysterious, Silent, Hidden)
- Nouns (e.g., Observer, Watcher, Listener)
- Unique identifiers based on registration number hash

## 🛡️ Security Considerations

- **No Personal Data**: The system never stores or processes personal names
- **Cryptographic Consistency**: Same regNo always generates same anonymous name
- **Developer Privacy**: Anonymous names are hidden from system administrators
- **Rate Limiting**: Prevents abuse and brute force attacks
- **Secure Hashing**: All sensitive data is properly hashed using bcrypt

## 📁 Project Structure

```
src/
├── config/          # Database and Redis configuration
├── controllers/     # Route controllers
├── middlewares/     # Authentication and validation middleware
├── models/          # MongoDB models
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions including anonymous name generation
└── server.ts        # Main server file
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for development setup and guidelines. 