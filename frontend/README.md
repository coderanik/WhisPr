# WhisPr Frontend

A modern, anonymous messaging platform built with Next.js and TypeScript.

## 🔐 Anonymous Authentication System

The frontend has been updated to work with the new anonymous authentication system:

- **Registration**: Users only need to provide their registration number and password
- **Anonymous Names**: Automatically generated and displayed throughout the interface
- **Login**: Simple authentication using registration number and password
- **Privacy**: No personal names are ever collected or displayed

## 🚀 Features

- **Anonymous Messaging**: Post messages using your generated anonymous name
- **Real-time Updates**: Messages appear instantly after posting
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: JWT-based authentication with session management
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Native fetch API with custom wrapper

## 📱 Pages

- **Forum** (`/forum`): View and post anonymous messages
- **My Messages** (`/my-messages`): View your own messages
- **Login** (`/login`): Authenticate with regNo and password
- **Register** (`/register`): Create account with regNo and password

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ 
- Backend server running on port 3001

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔄 API Integration

The frontend communicates with the backend API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/messages/forum` - Get public messages
- `POST /api/messages/create` - Create new message
- `GET /api/messages/my-messages` - Get user's messages

## 🎨 UI Components

- **Navbar**: Navigation with user authentication status
- **MessageForm**: Form for posting new messages
- **MessageCard**: Display individual messages
- **Toast**: Notification system for user feedback
- **AuthContext**: Authentication state management

## 🔒 Security Features

- **Anonymous Names**: No personal information is ever displayed
- **JWT Tokens**: Secure authentication with automatic token management
- **Session Persistence**: Login state maintained across browser sessions
- **Input Validation**: Client-side validation for all forms

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Desktop Optimized**: Enhanced experience on larger screens
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🚀 Deployment

The frontend can be deployed to any platform that supports Next.js:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site generation support
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🧪 Testing

To test the frontend with the backend:

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to the registration page
4. Create an account with your registration number
5. Login and start posting anonymous messages

## 🔄 Recent Updates

- ✅ Removed username field from registration and login
- ✅ Updated to use anonymous names throughout the interface
- ✅ Simplified authentication flow
- ✅ Enhanced privacy protection
- ✅ Improved user experience with clear messaging

## 📞 Support

For issues or questions:
1. Check the backend logs for API errors
2. Verify the backend server is running on port 3001
3. Check browser console for frontend errors
4. Ensure environment variables are properly set
