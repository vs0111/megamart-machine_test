# MegaMart Storefront Slice — Full-Stack E-Commerce Application

MegaMart Storefront Slice is a full-stack e-commerce application built using React 19, Vite, TypeScript, Express.js, Node.js, and MongoDB Atlas.

The project was developed based on the provided Figma design and assignment requirements. The goal was to build a functional e-commerce application with real database persistence rather than a frontend-only prototype.

Product data, users, carts, stock information, and orders are stored in MongoDB Atlas, while the React frontend communicates with the backend through REST APIs.

A major focus of the project was handling real-world inventory scenarios, especially preventing overselling when multiple users try to purchase the same limited-stock product at the same time. The application also includes JWT authentication, server-side product filtering, variant-based products, stale cart handling, and protected cart and order APIs.

---

## Key Features

### 1. Overselling and Concurrency Protection

One of the main challenges in the application was handling multiple checkout requests for the same product at the same time.

A traditional implementation might first check the available stock and then update it. This can create a race condition because two requests could read the same stock value before either request updates the database.

To prevent this, the checkout process uses an atomic MongoDB `findOneAndUpdate()` operation.

```typescript
const updatedProduct = await ProductModel.findOneAndUpdate(
  {
    _id: item.productId,
    "variants.id": item.variantId,
    "variants.stock": { $gte: item.quantity },
  },
  {
    $inc: {
      "variants.$.stock": -item.quantity,
    },
  },
  {
    returnDocument: "after",
  }
);
```

The important part is the `$gte` condition.

The database only performs the stock decrement when the requested quantity is still available. If multiple users try to purchase the last available unit simultaneously, one request can successfully update the stock while the other request fails because the stock condition is no longer satisfied.

This prevents the stock from becoming negative and protects the application from overselling.

---

### 2. Stale Cart Handling

Cart information can become outdated when a user keeps an item in their cart while another customer purchases the remaining stock.

To handle this situation, the cart is checked against the latest product information stored in MongoDB whenever it is retrieved.

The `getCart()` flow:

* Fetches the latest product and variant information.
* Compares the requested cart quantity with the current stock.
* Identifies products that are no longer available.
* Marks affected items with `isStale: true`.
* Adjusts the available quantity when required.
* Returns appropriate warnings to the frontend.

Checkout performs another validation before creating an order.

If the cart contains an item that is no longer available, the order is not created and the user receives a message such as:

```text
Checkout refused: The following items in your cart are out of stock. Please update your cart.
```

This prevents users from checking out using outdated inventory information.

---

### 3. Product Listing, Search and Filtering

The product catalogue is completely API-driven through:

```text
GET /api/products
```

The API supports:

* Product search
* Category filtering
* Minimum price filtering
* Maximum price filtering
* Price ascending and descending sorting
* Name sorting
* Newest products
* Server-side pagination

Example:

```text
/api/products?q=phone&category=Electronics&minPrice=5000&maxPrice=50000&sort=price_asc&page=1
```

Filtering, sorting, and pagination are handled on the server instead of downloading the complete product catalogue to the browser.

Categories are also loaded dynamically from MongoDB:

```text
GET /api/products/categories
```

---

### 4. Product Details and Variant Management

The product detail page supports multiple product images and different product variants.

Depending on the product, users can select options such as:

* Size
* Capacity
* Weight
* Color

When a user selects a different variant, the application updates the relevant product information, including:

* SKU
* Price
* Available stock
* Selected variant
* Stock status

The cart also validates stock before adding an item, preventing users from adding more units than are currently available.

---

### 5. Authentication and Security

The application includes a complete JWT-based authentication system.

Users can create an account through:

```text
POST /api/auth/register
```

Passwords are hashed using bcrypt before being stored in MongoDB. Plain-text passwords are never stored.

During login:

```text
POST /api/auth/login
```

the entered password is verified using `bcrypt.compare()`.

After successful authentication, the backend generates a signed JWT token that is used to authenticate protected requests.

The authenticated user's profile can be accessed through:

```text
GET /api/auth/me
```

JWT middleware is used to protect private resources, including cart and order operations.

The order creation endpoint is also protected:

```text
POST /api/orders
```

Only authenticated users can create orders.

---

## Project Structure

```text
MegaMart/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   Product cards, filters, layout, header, gallery
│   │   │
│   │   ├── pages/
│   │   │   ProductsPage, ProductDetailPage, CartPage, Auth
│   │   │
│   │   ├── services/
│   │   │   productService, cartService, authService
│   │   │
│   │   ├── store/
│   │   │   Zustand cartStore and authStore
│   │   │
│   │   └── types/
│   │       TypeScript interfaces
│   │
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/
    │   │   Database and environment configuration
    │   │
    │   ├── controllers/
    │   │   Auth, Product, Cart and Order controllers
    │   │
    │   ├── middleware/
    │   │   JWT authentication and Zod validation
    │   │
    │   ├── models/
    │   │   User, Product, Cart and Order models
    │   │
    │   ├── routes/
    │   │   Auth, Product, Cart and Order routes
    │   │
    │   ├── scripts/
    │   │   seedProducts.ts
    │   │
    │   └── services/
    │       User, Product and Cart services
    │
    ├── .env
    └── package.json
```

---

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=24h

NODE_ENV=development
```

Sensitive credentials should not be committed to the repository. The MongoDB connection string and JWT secret should be configured through environment variables.

---

## API Routes

| Method | Endpoint                   | Description                                                 |
| ------ | -------------------------- | ----------------------------------------------------------- |
| GET    | `/api/products`            | Get products with search, filtering, sorting and pagination |
| GET    | `/api/products/categories` | Get available product categories                            |
| GET    | `/api/products/:slug`      | Get product details by slug                                 |
| GET    | `/api/cart`                | Get the authenticated user's cart                           |
| POST   | `/api/cart/items`          | Add an item to the cart                                     |
| POST   | `/api/cart/add`            | Add an item to the cart                                     |
| PATCH  | `/api/cart/items/:id`      | Update cart item quantity                                   |
| PUT    | `/api/cart/item`           | Update cart item quantity                                   |
| DELETE | `/api/cart/items/:id`      | Remove a cart item                                          |
| DELETE | `/api/cart/item`           | Remove a cart item                                          |
| DELETE | `/api/cart`                | Clear the user's cart                                       |
| POST   | `/api/orders`              | Create an order and process stock deduction                 |
| POST   | `/api/cart/checkout`       | Checkout using the cart                                     |
| POST   | `/api/auth/register`       | Register a new user                                         |
| POST   | `/api/auth/login`          | Authenticate a user and issue JWT                           |
| GET    | `/api/auth/me`             | Get the authenticated user's profile                        |
| GET    | `/api/health`              | Check API and server health                                 |

---

## Database Seeding

The project includes a seed script for populating MongoDB Atlas with sample product data.

The seed contains 39 products across the following categories:

* Electronics
* Groceries
* Footwear
* Fashion

To seed the database:

```bash
cd server
npm run seed
```

The application retrieves this data through the product APIs instead of using hardcoded product information in the frontend.

---

## Getting Started

### 1. Clone the Project

```bash
git clone <repository-url>
cd MegaMart
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## What I Would Build Next

If I had another week to continue developing the project, I would extend the application with the following features.

### 1. Payment Gateway Integration

Integrate a payment gateway such as Stripe or Razorpay.

The payment flow would include:

* Payment order creation
* Payment confirmation
* Webhook handling
* Payment status verification
* Failed payment handling
* Order status updates

Webhooks would be used so that the backend can verify the actual payment status instead of relying only on the frontend response.

---

### 2. Order History and Tracking

Add an account dashboard where users can view their previous orders.

The dashboard could include:

* Order history
* Order details
* Current order status
* Delivery timeline
* Product information
* Invoice generation
* PDF invoice download

---

### 3. Redis Caching

Add Redis caching for frequently requested catalogue data, particularly product listing and category queries.

A possible flow would be:

```text
Client
   |
   v
API
   |
   v
Redis Cache
   |
   v
MongoDB
```

Frequently requested product queries could be served from Redis instead of querying MongoDB every time.

Cache invalidation would also be implemented whenever relevant product information changes.

---

### 4. Admin Inventory Dashboard

Build an admin dashboard for managing the catalogue and inventory.

The admin panel could support:

* Add products
* Edit products
* Delete products
* Manage variants
* Update stock
* Replenish inventory
* Manage product categories
* Manage discounts
* View orders
* Update order status

This would extend the application from a customer-facing storefront into a more complete e-commerce platform.

---

## Tech Stack

### Frontend

* React 19
* Vite
* TypeScript
* Tailwind CSS
* Zustand

### Backend

* Node.js
* Express.js
* TypeScript
* Mongoose
* Zod

### Database

* MongoDB Atlas

### Authentication

* JWT
* bcrypt

### Architecture

* REST API
* Service-based backend structure
* Protected routes
* Atomic MongoDB updates
* Server-side filtering and pagination
* Stock-aware cart management
* Variant-level inventory management

---

## Project Summary

The main goal of MegaMart was to build more than just a visually accurate e-commerce interface.

The project connects the frontend to a real backend and database, allowing products, users, carts, stock, and orders to persist properly.

One of the key backend challenges was maintaining inventory consistency during concurrent checkout requests. By using atomic MongoDB updates with stock conditions, the checkout process can handle multiple requests without allowing inventory to become negative.

The application also handles stale carts, variant-level stock, server-side product filtering, JWT authentication, password hashing, protected routes, and database seeding.

Overall, MegaMart demonstrates a complete React 19, TypeScript, Node.js, Express.js, and MongoDB e-commerce workflow with a focus on practical backend architecture, authentication, inventory management, data consistency, and real-world application behavior.
