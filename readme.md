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

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `PUT /api/v1/users/:userId` - Update user by ID
- `DELETE /api/v1/users/:userId` - Delete user by ID

### Vehicles
- `GET /api/v1/vehicles` - Get all vehicles
- `GET /api/v2/vehicle/:vehicleId` - Get vehicle by ID
- `POST /api/v1/vehicles` - Create vehicle (Admin only)
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking (Authenticated)
- `GET /api/v1/bookings` - Get bookings (Admin: all, Customer: own)
- `PUT /api/v1/bookings/:bookingId` - Update booking status (Admin: all, Customer: own)

---

## ⚙️ Automated Features

### Booking Auto-Return System
The system includes a scheduled job that runs **every hour midnight (Asia/Dhaka timezone)**:
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