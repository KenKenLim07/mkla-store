# 🛍️ Mikela Store

A modern e-commerce platform built with React, TypeScript, and Supabase. This is a full-stack web application featuring user authentication, product management, order processing, and an admin dashboard.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Vite with SWC
- **Deployment**: Vercel
- **Routing**: React Router DOM
- **Icons**: Heroicons

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mikela-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   In your Supabase dashboard, create the following tables:
   
   ```sql
   -- Products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     image_url TEXT,
     stocks INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders table
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     product_id UUID REFERENCES products(id),
     buyer_name TEXT NOT NULL,
     payment_proof_url TEXT,
     status TEXT DEFAULT 'pending',
     denial_reason TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Profiles table (extends auth.users)
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     role TEXT DEFAULT 'user',
     full_name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## 🏃‍♂️ Running the App

### Development
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

### Code Quality
```bash
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Navbar, Button, etc.)
│   ├── product/        # Product-related components
│   ├── checkout/       # Checkout flow components
│   └── admin/          # Admin panel components
├── pages/              # Route components (Home, Login, etc.)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useProducts.ts  # Product data fetching
│   └── useOrders.ts    # Order management
├── lib/                # External library configs
│   ├── supabase.ts     # Supabase client setup
│   └── auth.ts         # Auth utilities
├── routes/             # Route protection components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔐 Authentication & Authorization

The app uses Supabase Auth with role-based access control:

- **Users**: Can browse products, place orders, view their orders
- **Admins**: Can manage products, view all orders, access admin dashboard

### Protected Routes
- `/orders` - Requires authentication
- `/admin/*` - Requires admin role

## 🛒 Key Features

### User Features
- **Product Browsing**: View all available products
- **Order Placement**: Add products to cart and checkout
- **Payment**: Upload payment proof via QR code
- **Order Tracking**: View order status and history

### Admin Features
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **Dashboard**: Overview of sales and inventory

## 🎨 Styling

The app uses Tailwind CSS with:
- **Custom animations** for enhanced UX
- **Responsive design** for all screen sizes
- **Consistent color scheme** (pink theme)
- **Modern UI patterns** with hover effects and transitions

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Use custom hooks for data fetching
- Implement proper error boundaries

### State Management
- Use React hooks for local state
- Custom hooks for shared logic
- No global state management library needed

### Performance
- Code splitting is configured for vendor, router, and Supabase
- Optimistic updates for better UX
- Profile caching to reduce API calls

## 🚀 Deployment

The app is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📝 License

This project is private and proprietary.

---

**Built with ❤️ by Mikela**
