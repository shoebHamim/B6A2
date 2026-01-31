# 🚗 Vehicle Rental System

A robust backend API for managing vehicle rentals, built with Node.js, Express, TypeScript, and PostgreSQL.

**Live URL:** [https://b6-a2-gold.vercel.app/](https://b6-a2-gold.vercel.app/)

---

## ✨ Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin & Customer)
  - Secure password hashing with bcrypt

- **Vehicle Management**
  - CRUD operations for vehicles
  - Real-time availability tracking
  - Daily rent pricing system

- **Booking System**
  - Create and manage bookings
  - Automatic rental cost calculation
  - Booking status management (active, cancelled, returned)
  - **Automated return processing** - Bookings are automatically marked as "returned" when the rental period expires

- **Automated Background Jobs**
  - Daily cron job to process expired bookings
  - Automatic vehicle availability updates
  - Timezone-aware scheduling (Asia/Dhaka - UTC+6)

### Technical Features
- Type-safe development with TypeScript
- RESTful API architecture
- Database transactions for data integrity
- Connection pooling for optimal performance
- Comprehensive error handling
- Input validation and sanitization

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Language:** TypeScript
- **Database:** PostgreSQL (with `pg` driver)

### Key Dependencies
- **Authentication:** jsonwebtoken, bcryptjs
- **Scheduling:** node-cron (automated booking returns)
- **Environment Management:** dotenv
- **Development:** tsx (TypeScript execution)

### Development Tools
- TypeScript Compiler
- Prettier (code formatting)
- Type definitions for Node.js, Express, and PostgreSQL

---

## 📁 Project Structure

```
B6A2/
├── src/
│   ├── config/          # Database and environment configuration
│   ├── middlewares/     # Authentication and authorization
│   ├── models/          # Database table schemas
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication endpoints
│   │   ├── booking/     # Booking management
│   │   ├── user/        # User management
│   │   └── vehicle/     # Vehicle management
│   ├── services/        # Background jobs and schedulers
│   │   └── bookingScheduler.ts  # Automated return processor
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper utilities
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript output
├── .env.local           # Environment variables (not in repo)
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── vercel.json          # Deployment configuration
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shoebHamim/B6A2.git
   cd B6A2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   PORT=3000
   CONNECTION_STR=postgresql://username:password@localhost:5432/vehicle_rental
   SALT_ROUND=10
   JSON_SECRET=your_jwt_secret_key_here
   ```

4. **Database setup**
   
   The application will automatically create the required tables on first run:
   - `users` - User accounts and authentication
   - `vehicles` - Vehicle inventory
   - `bookings` - Rental bookings

5. **Build the project**
   ```bash
   npm run build
   ```

---

## 💻 Usage

### Development Mode
Run with hot-reload enabled:
```bash
npm run dev
```

### Production Mode
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   node dist/server.js
   ```

### Code Formatting
Format code with Prettier:
```bash
npm run format
```

---

## 🔌 API Endpoints

### Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://b6-a2-gold.vercel.app/`

---

### 🔐 Authentication

#### 1. Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+8801234567890",
  "role": "customer"
}
```
- `role` is optional. Values: `"customer"` (default) or `"admin"`

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801234567890",
    "role": "customer"
  }
}
```

**Validation:**
- Password must be at least 6 characters

---

#### 2. User Login
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+8801234567890",
      "role": "customer"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Incorrect email or password",
  "errors": []
}
```

---

### 👥 Users

#### 3. Get All Users (Admin Only)
```http
GET /api/v1/users
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+8801234567890",
      "role": "customer"
    }
  ]
}
```

---

#### 4. Update User
```http
PUT /api/v1/users/:userId
Authorization: Bearer <token>
Content-Type: application/json
```
- Both Admin and Customer can update users
- Customers can update their own profile

**Request Body** (all fields optional):
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "phone": "+8801987654321",
  "role": "customer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "phone": "+8801987654321",
    "role": "customer"
  }
}
```

**Error Response (404):**
```json
{
  "success": true,
  "statusCode": 404,
  "message": "No user found with the id!",
  "errors": []
}
```

---

#### 5. Delete User (Admin Only)
```http
DELETE /api/v1/users/:userId
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users deleted successfully"
}
```

**Error Response (400) - Has Active Bookings:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Failed to delete User",
  "errors": "User has active booking"
}
```

**Error Response (404) - User Not Found:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Failed to delete User",
  "errors": "No user found"
}
```

---

### 🚗 Vehicles

#### 6. Get All Vehicles
```http
GET /api/v1/vehicles
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_name": "Toyota Camry",
      "type": "Sedan",
      "registration_number": "DHK-1234",
      "daily_rent_price": 5000,
      "availability_status": "available"
    }
  ]
}
```

---

#### 7. Get Vehicle by ID
```http
GET /api/v1/vehicles/:vehicleId
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "Sedan",
    "registration_number": "DHK-1234",
    "daily_rent_price": 5000,
    "availability_status": "available"
  }
}
```

---

#### 8. Create Vehicle (Admin Only)
```http
POST /api/v1/vehicles
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vehicle_name": "Toyota Camry",
  "type": "Sedan",
  "registration_number": "DHK-1234",
  "daily_rent_price": 5000,
  "availability_status": "available"
}
```
- `availability_status`: `"available"` or `"booked"`

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "Sedan",
    "registration_number": "DHK-1234",
    "daily_rent_price": 5000,
    "availability_status": "available"
  }
}
```

---

#### 9. Update Vehicle (Admin Only)
```http
PUT /api/v1/vehicles/:vehicleId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "Sedan",
  "registration_number": "DHK-1234",
  "daily_rent_price": 5500,
  "availability_status": "available"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "Sedan",
    "registration_number": "DHK-1234",
    "daily_rent_price": 5500,
    "availability_status": "available"
  }
}
```

---

#### 10. Delete Vehicle (Admin Only)
```http
DELETE /api/v1/vehicles/:vehicleId
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vehicle deleted successfully"
}
```

**Error Response (400) - Has Active Bookings:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Vehicle deletion failed",
  "errors": "This vehicle has active booking"
}
```

---

### 📅 Bookings

#### 11. Create Booking (Authenticated)
```http
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer_id": 1,
  "vehicle_id": 5,
  "rent_start_date": "2026-02-01",
  "rent_end_date": "2026-02-05"
}
```
- Date format: `YYYY-MM-DD`
- `rent_end_date` must be after `rent_start_date`
- Vehicle must be available

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Booking created successfully",
  "data": {
    "id": 10,
    "customer_id": 1,
    "vehicle_id": 5,
    "rent_start_date": "2026-02-01",
    "rent_end_date": "2026-02-05",
    "total_price": 20000,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Toyota Camry",
      "daily_rent_price": 5000
    }
  }
}
```
- `total_price` is automatically calculated based on rental days × daily_rent_price

---

#### 12. Get All Bookings
```http
GET /api/v1/bookings
Authorization: Bearer <token>
```
- **Admin**: Returns all bookings
- **Customer**: Returns only their own bookings

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 10,
      "customer_id": 1,
      "vehicle_id": 5,
      "rent_start_date": "2026-02-01",
      "rent_end_date": "2026-02-05",
      "total_price": 20000,
      "status": "active"
    }
  ]
}
```

---

#### 13. Update Booking Status
```http
PUT /api/v1/bookings/:bookingId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "returned"
}
```
- Status values: `"active"`, `"cancelled"`, or `"returned"`

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking updated successfully",
  "data": {
    "id": 10,
    "customer_id": 1,
    "vehicle_id": 5,
    "rent_start_date": "2026-02-01",
    "rent_end_date": "2026-02-05",
    "total_price": 20000,
    "status": "returned",
    "vehicle": {
      "availability_status": "available"
    }
  }
}
```
- When status is changed to `"returned"` or `"cancelled"`, the vehicle automatically becomes available

---

### 🔒 Authentication Headers

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### ⚠️ Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": "Detailed error message or validation errors"
}
```

## ⚙️ Automated Features

### Booking Auto-Return System
The system includes a scheduled job that runs **every day at midnight (Asia/Dhaka timezone)**:
- Identifies all active bookings where `rent_end_date` has passed
- Automatically updates their status to "returned"
- Releases associated vehicles back to "available" status
- Uses database transactions to ensure data consistency

This automation ensures that:
- No manual intervention is needed for expired bookings
- Vehicle availability is kept up-to-date
- Customers and admins see accurate booking statuses

---

## 🔒 Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- SQL injection prevention via parameterized queries
- Environment variable protection
- Input validation and sanitization

---

## 🌐 Deployment

The application is deployed on **Vercel** with serverless functions.

**Live URL:** [https://b6-a2-gold.vercel.app/](https://b6-a2-gold.vercel.app/)

### Vercel Deployment Notes
- Database timezone set to `Asia/Dhaka` (UTC+6)
- Automated schedulers run on deployment platform
- Environment variables configured in Vercel dashboard

---

## 👨‍💻 Author

**Shoeb Islam Hamim**

- GitHub: [@shoebHamim](https://github.com/shoebHamim)
- Repository: [B6A2](https://github.com/shoebHamim/B6A2)

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

Created as part of the Programming Hero Next Level course assignment.