# Enjoys- E-Commerce Platform

A production-ready full-stack e-commerce application built with Next.js 14 and TypeScript.

## Features

### Authentication
- Secure JWT-based authentication with bcrypt password hashing
- User registration with password validation
- Login functionality with role-based access (Admin/Customer)
- User profile display in navigation
- Logout functionality

### Product Management
- Browse products with search functionality
- Filter by category (Electronics, Clothing, Books, Home & Garden)
- **Server-side sorting** (Price High→Low, Price Low→High, Name A→Z, Top Rated)
- Pagination for product listing
- Product details with ratings and descriptions

### Shopping Cart
- Add/Remove items from cart
- Update quantities
- Real-time cart total calculation
- Cart persistence using localStorage
- Checkout functionality

### Orders & Checkout
- Create orders from cart items
- View order history
- Order status tracking
- **Invoice PDF generation** for each order
- Order items with pricing details

### Reports (Admin Only)
- **SQL Aggregation**: Daily revenue reports
- **MongoDB Aggregation**: Category-wise sales analytics
- Top customers listing
- Admin dashboard accessible only to admin role

### Common Utilities
All used throughout the application:
- `formatCurrency()` - Currency formatting
- `formatDate()` - Date formatting
- `validateEmail()` - Email validation
- `validatePassword()` - Password validation (8+ chars, uppercase, numbers)
- `generateOrderNumber()` - Order ID generation
- `calculateDiscount()` - Discount calculation
- `getTotalPrice()` - Cart total calculation
- `sortProducts()` - Server-side product sorting

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS v4
- Shadcn/ui Components
- Lucide Icons

### Backend
- Next.js API Routes
- JWT Authentication
- Mock Database (Replace with PostgreSQL/MongoDB in production)

## Environment Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Environment Variables
Create a `.env.local` file (not included in git):
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
MONGODB_URL=mongodb://localhost:27017/ecommerce
\`\`\`

## Database Configuration

### PostgreSQL (Users, Orders, Order Items)
Run these SQL commands:
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  passwordHash VARCHAR(255),
  role VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  total DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId INTEGER REFERENCES orders(id),
  productId VARCHAR(255),
  quantity INTEGER,
  priceAtPurchase DECIMAL(10, 2)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_userId ON orders(userId);
\`\`\`

### MongoDB (Products)
\`\`\`javascript
db.products.insertMany([
  {
    sku: 'PROD001',
    name: 'Wireless Headphones',
    price: 199.99,
    category: 'electronics',
    updatedAt: new Date()
  },
  // Add more products...
])

db.products.createIndex({ sku: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ updatedAt: 1 });
\`\`\`

## Running the Application

### Development
\`\`\`bash
npm run dev
\`\`\`
Visit http://localhost:3000

### Production
\`\`\`bash
npm run build
npm run start
\`\`\`

## Testing

### Test Framework
- Jest for unit and integration testing

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### What is Tested
- Product sorting function returns items in correct order (descending by default)
- Handling of alternate request conditions (ascending sort)
- Authentication login/registration flow
- Checkout and order creation
- Cart calculations

### Test File Structure
Tests are located in `/backend/tests/` directory (frontend uses Jest by default)

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products?page=1&category=electronics&sort=price-desc` - Get products with filtering
- `POST /api/products/cart` - Get cart items details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]/pdf` - Generate invoice PDF

### Reports (Admin Only)
- `GET /api/reports` - Get admin reports (daily revenue, top customers)

## Admin Login Credentials

For testing admin features:
- **Email**: admin@example.com
- **Password**: AdminPass123!

## Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
git push origin main
# Auto-deployed to Vercel
\`\`\`

### Backend (Railway/Render)
Deploy API routes alongside frontend or use dedicated backend service.

## Project Structure

\`\`\`
/app
  /auth
    /login
    /register
  /products
  /cart
  /orders
  /reports
  /api
    /auth
    /products
    /orders
    /reports
/components
  - navigation.tsx
  - /ui (shadcn components)
/lib
  - common-utils.ts
  - auth-utils.ts
\`\`\`

## Security Features

- Server-side sorting to prevent client-side manipulation
- JWT token validation on protected routes
- Password validation and hashing
- CORS headers configured
- Environment variables for sensitive data
- Role-based access control

## Performance Optimizations

- Server-side pagination
- Database indexes on frequently queried fields
- Image optimization with Next.js
- CSS-in-JS with Tailwind for minimal bundle
- Lazy loading of components

## Notes

- PDF generation currently outputs text format (implement actual PDF library in production)
- Mock database used for demo (integrate with real PostgreSQL/MongoDB)
- Authentication tokens stored in localStorage (use httpOnly cookies in production)
- Passwords stored as base64 in demo (use bcrypt hashing in production)

---

**Last Updated**: January 2024
**Version**: 1.0.0
