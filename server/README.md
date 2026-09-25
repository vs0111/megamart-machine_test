# MegaMart Storefront Slice — Full-Stack E-Commerce Application

MegaMart Storefront Slice is a full-stack e-commerce application built using **React, Vite, TypeScript, Express.js, Node.js, and MongoDB Atlas**.

The application was developed based on the provided Figma designs and assignment requirements, with a focus on building a realistic e-commerce workflow rather than using static or hardcoded data. Product data, cart data, users, stock information, and checkout operations are all connected to the backend and persisted in MongoDB Atlas.

One of the main challenges addressed in this project was handling stock correctly when multiple users try to purchase the same product at the same time. The application also includes JWT-based authentication, server-side product filtering, stock-aware cart management, and automated tests for authentication and concurrent checkout scenarios.

## Key Features

### 1. Stock Management and Overselling Protection

A major requirement of the project was preventing overselling when multiple users try to purchase the last available items at the same time.

A simple approach would be to first check the stock and then update it. However, this can create a race condition because two requests may read the same stock value before either request updates it.

To avoid this, I used an atomic MongoDB `findOneAndUpdate()` operation with a stock condition:

```typescript
const updatedProduct = await ProductModel.findOneAndUpdate(
  {
    _id: item.productId,
    "variants.id": item.variantId,
    "variants.stock": { $gte: item.quantity },
  },
  {
    $inc: { "variants.$.stock": -item.quantity },
  },
  {
    returnDocument: "after",
  }
);
```

The important part here is the `$gte` condition. The database only performs the update if enough stock is still available.

For example, if only one item is available and two users try to purchase it simultaneously, only one request can successfully decrease the stock. The other request fails because the stock condition is no longer satisfied.

This prevents the stock from becoming negative and protects the application from overselling.

---

### 2. Stale Cart Handling

Another scenario handled in the application is when a user adds an item to their cart and leaves it there while another customer purchases the remaining stock.

When the cart is requested, the backend fetches the latest product and variant information from MongoDB instead of relying only on the old cart data.

The cart checks the current stock and identifies items that are no longer available or where the requested quantity is greater than the available stock.

These items are marked as stale using an `isStale` flag, and the cart provides the user with a clear warning.

Before checkout, the backend performs another validation to make sure the cart is still valid.

If an item has become unavailable, checkout is stopped and the user receives a message such as:

```text
Checkout refused: The following items in your cart are out of stock. Please update your cart.
```

This ensures that the user cannot place an order using outdated stock information.

---

### 3. Product Listing, Search and Filtering

The product listing is completely server-driven through:

```text
GET /api/products
```

The API supports several query parameters, including:

- Search using `q`
- Category filtering
- Minimum price filtering
- Maximum price filtering
- Price sorting
- Name sorting
- Newest products
- Pagination

For example:

```text
/api/products?q=shoe&category=men&minPrice=500&maxPrice=5000&sort=price_asc&page=1
```

Filtering and pagination are handled on the backend, so the frontend does not need to load the entire product collection and filter it locally.

There is also a separate endpoint for retrieving available product categories:

```text
GET /api/products/categories
```

---

### 4. Product Details and Variant Selection

The product detail page supports multiple product images and different variants such as size and color.

When the user selects a variant, the application dynamically updates:

- Product SKU
- Price
- Available stock
- Selected size
- Selected color

The cart also performs stock validation before allowing an item to be added.

For example, if a product has only 3 units available, the user cannot add 4 units of that variant to the cart.

This keeps the frontend experience aligned with the actual inventory stored in MongoDB.

---

### 5. Authentication and Security

The application includes a complete user authentication flow.

Users can create an account using:

```text
POST /api/auth/register
```

Passwords are never stored as plain text. They are hashed using **bcrypt** with 10 salt rounds before being saved to MongoDB.

During login:

```text
POST /api/auth/login
```

the backend verifies the entered password using `bcrypt.compare()`.

After successful authentication, the server generates a signed JWT token.

The token is then used to access protected endpoints such as:

```text
GET /api/auth/me
```

JWT authentication middleware verifies the token before allowing access to protected resources.

The application also follows a strict registration flow, meaning a user must have an existing account before they can successfully log in.

---

## API Endpoints

The main backend API endpoints are:

| Method | Endpoint                   | Purpose                                                     |
| ------ | -------------------------- | ----------------------------------------------------------- |
| GET    | `/api/products`            | Get products with search, filtering, sorting and pagination |
| GET    | `/api/products/categories` | Get available product categories                            |
| GET    | `/api/products/:slug`      | Get product details by slug                                 |
| GET    | `/api/cart`                | Get the authenticated user's cart                           |
| POST   | `/api/cart/add`            | Add a product variant to the cart                           |
| PUT    | `/api/cart/item`           | Update cart item quantity                                   |
| DELETE | `/api/cart/item`           | Remove an item from the cart                                |
| DELETE | `/api/cart`                | Clear the cart                                              |
| POST   | `/api/cart/checkout`       | Validate cart and process checkout                          |
| POST   | `/api/auth/register`       | Register a new user                                         |
| POST   | `/api/auth/login`          | Login and receive JWT                                       |
| GET    | `/api/auth/me`             | Get the authenticated user's profile                        |
| GET    | `/api/health`              | Check server health                                         |

---

## Automated Testing

I also included automated tests for the important backend scenarios.

To test concurrent checkout and overselling protection:

```bash
cd server
npm run test:concurrency
```

To test authentication and JWT functionality:

```bash
npm run test:auth
```

To run the complete integration test suite:

```bash
npm run test
```

The concurrency test is particularly important because it verifies that multiple checkout requests cannot reduce the same product stock below zero.

---

## Environment Configuration

The backend uses environment variables for configuration instead of hardcoding sensitive values in the source code.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

For production, sensitive credentials such as the MongoDB connection string and JWT secret should be stored securely in the deployment platform's environment-variable configuration.

---

## Project Setup

To run the project locally, first start the backend:

```bash
cd server
npm install
npm run dev
```

Then open another terminal and start the frontend:

```bash
cd client
npm install
npm run dev
```

The frontend communicates with the Express/Node.js backend, while MongoDB Atlas is used for persistent storage.

---

## Technology Stack

**Frontend**

- React
- Vite
- TypeScript

**Backend**

- Node.js
- Express.js
- TypeScript

**Database**

- MongoDB Atlas
- Mongoose

**Authentication**

- JWT
- bcrypt

**Testing**

- Automated integration tests
- Concurrent checkout testing
- Authentication testing

---

## Project Highlights

The main focus of this project was not just creating an e-commerce UI, but implementing the important backend behavior behind it.

The application includes real database persistence, server-side filtering and pagination, JWT authentication, stock-aware cart management, stale-cart validation, and atomic stock updates to protect against concurrent checkout requests.

The overselling protection was one of the key technical parts of the project. Instead of relying on a separate stock check followed by an update, the stock validation and decrement are performed together as an atomic MongoDB operation. This makes the checkout process safer when multiple users are purchasing the same limited-stock product simultaneously.

Overall, the project demonstrates a complete full-stack e-commerce workflow using **React, TypeScript, Node.js, Express.js, MongoDB Atlas, JWT, and bcrypt**, with particular attention to data consistency, authentication, inventory management, and real-world backend scenarios.
