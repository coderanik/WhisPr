# Whispr Backend API

A secure, anonymous messaging forum with encryption and rate limiting.

## Features

- **Secure Encryption**: All messages are encrypted using AES encryption
- **User Names**: Messages display the user's registered name
- **Rate Limiting**: 5 messages per minute per user
- **Auto Cleanup**: Messages are automatically deactivated after 24 hours
- **Privacy Focused**: Even developers cannot see actual message content
- **No Deletion**: Once posted, messages cannot be deleted

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Messages

#### Create Message
```
POST /api/messages/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your message here (max 1000 characters)"
}
```

**Response:**
```json
{
  "message": "Message posted successfully",
  "displayName": "John Doe",
  "messageId": "message_id_here"
}
```

#### Get Forum Messages (Public)
```
GET /api/messages/forum
```

**Response:**
```json
{
  "messages": [
    {
      "displayName": "John Doe",
      "postedAt": "2024-01-01T12:00:00.000Z",
      "messageDate": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### Get User's Own Messages
```
GET /api/messages/my-messages
Authorization: Bearer <token>
```

**Response:**
```json
{
  "messages": [
    {
      "id": "message_id",
      "content": "Your decrypted message content",
      "displayName": "MysteriousWalker123",
      "postedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```



#### Get Message Count (Rate Limiting)
```
GET /api/messages/count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "messageCount": 2,
  "limit": 5,
  "remaining": 3
}
```



## Security Features

1. **Message Encryption**: All messages are encrypted using AES-256
2. **User Names**: Messages display the user's registered name
3. **Rate Limiting**: 5 messages per minute per user
4. **Auto Cleanup**: Messages deactivated after 24 hours
5. **Privacy**: Even developers cannot decrypt messages without proper access
6. **No Deletion**: Messages cannot be deleted once posted

## Environment Variables

```env
ENCRYPTION_KEY=your-super-secret-encryption-key-32-chars
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
```

## Rate Limiting

- **Per User**: 5 messages per minute
- **Per IP**: 5 requests per minute for message creation
- **Automatic**: Messages are deactivated after 24 hours

## Message Lifecycle

1. User creates message → Content encrypted → Stored with user's registered name
2. Other users see only user names in forum
3. User can see their own decrypted messages
4. Messages automatically deactivated after 24 hours
5. Daily cleanup process removes old messages
6. Messages cannot be deleted once posted

## Error Responses

```json
{
  "error": "Rate limit exceeded. You can only post 5 messages per minute.",
  "retryAfter": 60
}
```

```json
{
  "error": "Message cannot exceed 1000 characters"
}
```

```json
{
  "error": "Authentication required"
}
``` 