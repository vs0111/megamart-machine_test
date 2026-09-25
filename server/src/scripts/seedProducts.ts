import { connectDB } from '../config/db.js';
import { ProductModel } from '../models/productModel.js';
import mongoose from 'mongoose';

export const SEED_PRODUCTS = [
  // --- Electronics (10 items) ---
  {
    slug: 'apple-iphone-15-pro-128gb',
    name: 'Apple iPhone 15 Pro (Titanium, Super Retina XDR Display)',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    minPrice: 129990,
    maxPrice: 149990,
    variants: [
      { id: 'v-ip15-128-nat', sku: 'IP15P-128-NAT', size: '128 GB', color: 'Natural Titanium', price: 129990, originalPrice: 134900, stock: 15, inStock: true },
      { id: 'v-ip15-256-blk', sku: 'IP15P-256-BLK', size: '256 GB', color: 'Titanium Black', price: 139990, originalPrice: 144900, stock: 12, inStock: true },
      { id: 'v-ip15-512-blu', sku: 'IP15P-512-BLU', size: '512 GB', color: 'Sierra Blue', price: 149990, originalPrice: 154900, stock: 6, inStock: true },
    ],
  },
  {
    slug: 'sony-wh-1000xm5-wireless-headphones',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones for unprecedented sound quality and crystal-clear hands-free calling.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    minPrice: 29990,
    maxPrice: 34990,
    variants: [
      { id: 'v-wh5-blk', sku: 'SONY-XM5-BLK', size: 'Standard', color: 'Matte Black', price: 29990, originalPrice: 34990, stock: 25, inStock: true },
      { id: 'v-wh5-slv', sku: 'SONY-XM5-SLV', size: 'Standard', color: 'Silver', price: 29990, originalPrice: 34990, stock: 14, inStock: true },
    ],
  },
  {
    slug: 'samsung-galaxy-s24-ultra-5g',
    name: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, unleash whole new levels of creativity, productivity, and gaming power.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    minPrice: 129999,
    maxPrice: 149999,
    variants: [
      { id: 'v-s24-256-blk', sku: 'S24U-256-BLK', size: '256 GB', color: 'Titanium Black', price: 129999, originalPrice: 134999, stock: 18, inStock: true },
      { id: 'v-s24-512-blu', sku: 'S24U-512-BLU', size: '512 GB', color: 'Sierra Blue', price: 139999, originalPrice: 144999, stock: 8, inStock: true },
      { id: 'v-s24-1tb-gry', sku: 'S24U-1TB-GRY', size: '1 TB', color: 'Space Grey', price: 149999, originalPrice: 154999, stock: 4, inStock: true },
    ],
  },
  {
    slug: 'apple-macbook-air-m3-15inch',
    name: 'Apple MacBook Air 15-inch M3 Chip',
    description: 'Incredibly thin and fast 15-inch laptop with Liquid Retina display, M3 chip speed, and up to 18 hours of battery life.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    minPrice: 154900,
    maxPrice: 174900,
    variants: [
      { id: 'v-mba-16-512-gry', sku: 'MBA-M3-16-512', size: '16 GB RAM / 512 GB SSD', color: 'Space Grey', price: 154900, originalPrice: 164900, stock: 10, inStock: true },
      { id: 'v-mba-24-1tb-str', sku: 'MBA-M3-24-1TB', size: '24 GB RAM / 1 TB SSD', color: 'Starlight', price: 174900, originalPrice: 184900, stock: 5, inStock: true },
    ],
  },
  {
    slug: 'bose-quietcomfort-ultra-earbuds',
    name: 'Bose QuietComfort Ultra Noise Cancelling Earbuds',
    description: 'Breakthrough spatialized audio for more immersive listening that makes your music feel realer than ever before. World-class noise cancellation.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    minPrice: 25900,
    maxPrice: 25900,
    variants: [
      { id: 'v-bose-blk', sku: 'BOSE-QC-BLK', size: 'Standard', color: 'Black', price: 25900, originalPrice: 28900, stock: 20, inStock: true },
      { id: 'v-bose-wht', sku: 'BOSE-QC-WHT', size: 'Standard', color: 'White', price: 25900, originalPrice: 28900, stock: 14, inStock: true },
    ],
  },
  {
    slug: 'dell-xps-15-oled-laptop',
    name: 'Dell XPS 15 OLED Touchscreen Creator Laptop',
    description: 'Stunning 3.5K OLED display meets 13th Gen Intel Core i9 performance and NVIDIA GeForce RTX 4070 graphics for ultimate content creation.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    minPrice: 249990,
    maxPrice: 269990,
    variants: [
      { id: 'v-xps-32-1tb', sku: 'DELL-XPS-32-1TB', size: '32 GB RAM / 1 TB SSD', color: 'Platinum Silver', price: 249990, originalPrice: 269990, stock: 6, inStock: true },
      { id: 'v-xps-64-2tb', sku: 'DELL-XPS-64-2TB', size: '64 GB RAM / 2 TB SSD', color: 'Graphite Black', price: 269990, originalPrice: 289990, stock: 3, inStock: true },
    ],
  },
  {
    slug: 'ipad-air-11-inch-m2-256gb',
    name: 'Apple iPad Air 11-inch M2 Chip',
    description: 'Fresh design with a stunning Liquid Retina display, the supercharged Apple M2 chip, and all-day battery life.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    minPrice: 69900,
    maxPrice: 89900,
    variants: [
      { id: 'v-ipad-128-gry', sku: 'IPAD-M2-128', size: '128 GB', color: 'Space Grey', price: 69900, originalPrice: 74900, stock: 16, inStock: true },
      { id: 'v-ipad-256-str', sku: 'IPAD-M2-256', size: '256 GB', color: 'Starlight', price: 79900, originalPrice: 84900, stock: 11, inStock: true },
      { id: 'v-ipad-512-prp', sku: 'IPAD-M2-512', size: '512 GB', color: 'Purple', price: 89900, originalPrice: 94900, stock: 5, inStock: true },
    ],
  },
  {
    slug: 'apple-watch-series-9-gps',
    name: 'Apple Watch Series 9 GPS Aluminum Smartwatch',
    description: 'S9 SiP enables a super-bright display and a magical new way to quickly interact with your Apple Watch using Double Tap gestures.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    minPrice: 41900,
    maxPrice: 44900,
    variants: [
      { id: 'v-watch-41-mid', sku: 'AW9-41-MID', size: '41 mm', color: 'Midnight', price: 41900, originalPrice: 44900, stock: 22, inStock: true },
      { id: 'v-watch-45-slv', sku: 'AW9-45-SLV', size: '45 mm', color: 'Silver', price: 44900, originalPrice: 47900, stock: 18, inStock: true },
    ],
  },

  // --- Groceries (6 items) ---
  {
    slug: 'organic-extra-virgin-olive-oil-1l',
    name: 'Cold Pressed Organic Extra Virgin Olive Oil',
    description: 'First cold-pressed 100% organic Mediterranean olive oil, rich in antioxidants and healthy monounsaturated fats.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    minPrice: 599,
    maxPrice: 1899,
    variants: [
      { id: 'v-oil-500ml', sku: 'EVOO-500ML', size: '500 ml', color: 'Extra Virgin', price: 599, originalPrice: 799, stock: 40, inStock: true },
      { id: 'v-oil-1l', sku: 'EVOO-1L', size: '1 Litre', color: 'Extra Virgin', price: 999, originalPrice: 1299, stock: 50, inStock: true },
      { id: 'v-oil-2l', sku: 'EVOO-2L', size: '2 Litres', color: 'Extra Virgin', price: 1899, originalPrice: 2299, stock: 20, inStock: true },
    ],
  },
  {
    slug: 'kashmiri-organic-saffron-5g',
    name: 'Premium Grade A+ Organic Kashmiri Saffron (Mongra)',
    description: '100% pure, authentic, handpicked Kashmiri saffron strands. Renowned globally for its deep crimson color, rich aroma, and health benefits.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    minPrice: 450,
    maxPrice: 3200,
    variants: [
      { id: 'v-saffron-1g', sku: 'SAFF-1G', size: '1 g', color: 'Grade A+ Mongra', price: 450, originalPrice: 550, stock: 60, inStock: true },
      { id: 'v-saffron-5g', sku: 'SAFF-5G', size: '5 g', color: 'Grade A+ Mongra', price: 1850, originalPrice: 2200, stock: 40, inStock: true },
      { id: 'v-saffron-10g', sku: 'SAFF-10G', size: '10 g', color: 'Grade A+ Mongra', price: 3200, originalPrice: 3800, stock: 15, inStock: true },
    ],
  },
  {
    slug: 'raw-unfiltered-wildflower-honey-500g',
    name: 'Pure Raw Unfiltered Wildflower Honey - Glass Jar',
    description: 'Directly harvested from organic forest hives. Rich in live enzymes, pollens, and natural phytonutrients with zero added sugars.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    minPrice: 299,
    maxPrice: 899,
    variants: [
      { id: 'v-honey-250', sku: 'HONEY-250G', size: '250 g', color: 'Raw Natural', price: 299, originalPrice: 399, stock: 50, inStock: true },
      { id: 'v-honey-500', sku: 'HONEY-500G', size: '500 g', color: 'Raw Natural', price: 499, originalPrice: 650, stock: 65, inStock: true },
      { id: 'v-honey-1kg', sku: 'HONEY-1KG', size: '1 kg', color: 'Raw Natural', price: 899, originalPrice: 1100, stock: 30, inStock: true },
    ],
  },
  {
    slug: 'roasted-california-almonds-1kg',
    name: 'Premium Jumbo California Almonds',
    description: 'Crunchy, slow-roasted Jumbo California almonds packed with protein, healthy fats, and Vitamin E. Ideal daily energy snack.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1508061252966-dfd30f67ea55?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1508061252966-dfd30f67ea55?auto=format&fit=crop&w=800&q=80',
    minPrice: 269,
    maxPrice: 899,
    variants: [
      { id: 'v-almond-250', sku: 'ALM-250G', size: '250 g', color: 'Roasted & Salted', price: 269, originalPrice: 350, stock: 90, inStock: true },
      { id: 'v-almond-500', sku: 'ALM-500G', size: '500 g', color: 'Roasted & Salted', price: 489, originalPrice: 600, stock: 75, inStock: true },
      { id: 'v-almond-1kg', sku: 'ALM-1KG', size: '1 kg', color: 'Roasted & Salted', price: 899, originalPrice: 1199, stock: 80, inStock: true },
    ],
  },
  {
    slug: 'specialty-grade-coffee-beans-500g',
    name: 'Artisan Single-Origin Arabica Coffee Beans',
    description: 'Single-origin estate Arabica whole beans with tasting notes of dark chocolate, toasted hazelnut, and subtle caramel sweetness.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    minPrice: 349,
    maxPrice: 1199,
    variants: [
      { id: 'v-coffee-250', sku: 'COFFEE-250', size: '250 g', color: 'Dark Roast', price: 349, originalPrice: 459, stock: 50, inStock: true },
      { id: 'v-coffee-500', sku: 'COFFEE-500', size: '500 g', color: 'Dark Roast', price: 649, originalPrice: 799, stock: 45, inStock: true },
      { id: 'v-coffee-1kg', sku: 'COFFEE-1KG', size: '1 kg', color: 'Dark Roast', price: 1199, originalPrice: 1499, stock: 25, inStock: true },
    ],
  },
  {
    slug: 'himalayan-pink-rock-salt-1kg',
    name: 'Organic Himalayan Pink Mineral Rock Salt',
    description: 'Unrefined, 100% natural rock salt mined from ancient Himalayan beds. Contains 84 trace minerals for holistic culinary seasoning.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    minPrice: 119,
    maxPrice: 499,
    variants: [
      { id: 'v-salt-500g', sku: 'SALT-500G', size: '500 g', color: 'Fine Mineral Salt', price: 119, originalPrice: 169, stock: 120, inStock: true },
      { id: 'v-salt-1kg', sku: 'SALT-1KG', size: '1 kg', color: 'Fine Mineral Salt', price: 199, originalPrice: 299, stock: 100, inStock: true },
      { id: 'v-salt-5kg', sku: 'SALT-5KG', size: '5 kg', color: 'Fine Mineral Salt', price: 499, originalPrice: 699, stock: 40, inStock: true },
    ],
  },

  // --- Fashion (8 items) ---
  {
    slug: 'classic-cotton-oxford-shirt',
    name: 'Men Premium Classic Cotton Oxford Button-Down Shirt',
    description: 'Crafted from 100% breathable combed cotton yarn. Soft, durable, and tailored for effortless casual sophistication.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    minPrice: 1499,
    maxPrice: 1499,
    variants: [
      { id: 'v-shirt-nav-s', sku: 'SHIRT-NAV-S', size: 'S', color: 'Navy', price: 1499, originalPrice: 2499, stock: 10, inStock: true },
      { id: 'v-shirt-nav-m', sku: 'SHIRT-NAV-M', size: 'M', color: 'Navy', price: 1499, originalPrice: 2499, stock: 18, inStock: true },
      { id: 'v-shirt-wht-l', sku: 'SHIRT-WHT-L', size: 'L', color: 'White', price: 1499, originalPrice: 2499, stock: 22, inStock: true },
      { id: 'v-shirt-blk-xl', sku: 'SHIRT-BLK-XL', size: 'XL', color: 'Black', price: 1499, originalPrice: 2499, stock: 5, inStock: true },
    ],
  },
  {
    slug: 'nike-air-zoom-running-shoes',
    name: 'Nike Air Zoom Pegasus Performance Running Sneakers',
    description: 'Engineered mesh upper for breathability and responsive Zoom Air cushioning that delivers energy return with every stride.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    minPrice: 8995,
    maxPrice: 8995,
    variants: [
      { id: 'v-nike-uk7', sku: 'NIKE-PEG-UK7', size: 'UK 7', color: 'Red', price: 8995, originalPrice: 10995, stock: 8, inStock: true },
      { id: 'v-nike-uk8', sku: 'NIKE-PEG-UK8', size: 'UK 8', color: 'Black', price: 8995, originalPrice: 10995, stock: 15, inStock: true },
      { id: 'v-nike-uk9', sku: 'NIKE-PEG-UK9', size: 'UK 9', color: 'Black', price: 8995, originalPrice: 10995, stock: 20, inStock: true },
      { id: 'v-nike-uk10', sku: 'NIKE-PEG-UK10', size: 'UK 10', color: 'White', price: 8995, originalPrice: 10995, stock: 12, inStock: true },
    ],
  },
  {
    slug: 'levis-501-original-straight-jeans',
    name: 'Levi’s 501 Original Fit Straight Leg Denim Jeans',
    description: 'The iconic straight fit with button fly. Crafted from non-stretch 100% cotton denim that breaks in over time for custom fit.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    minPrice: 3599,
    maxPrice: 3599,
    variants: [
      { id: 'v-lev-30-nvy', sku: 'LEV-501-30', size: '30', color: 'Navy', price: 3599, originalPrice: 4599, stock: 14, inStock: true },
      { id: 'v-lev-32-nvy', sku: 'LEV-501-32', size: '32', color: 'Navy', price: 3599, originalPrice: 4599, stock: 19, inStock: true },
      { id: 'v-lev-34-blk', sku: 'LEV-501-34', size: '34', color: 'Black', price: 3599, originalPrice: 4599, stock: 10, inStock: true },
    ],
  },
  {
    slug: 'adidas-ultraboost-10-dna-shoes',
    name: 'Adidas Ultraboost 1.0 DNA Cushioned Running Sneakers',
    description: 'Primeknit textile upper wraps the foot in adaptive support, paired with responsive BOOST midsole for incredible energy return.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    minPrice: 11999,
    maxPrice: 11999,
    variants: [
      { id: 'v-ub-uk8-blk', sku: 'ADI-UB-UK8', size: 'UK 8', color: 'Black', price: 11999, originalPrice: 14999, stock: 12, inStock: true },
      { id: 'v-ub-uk9-wht', sku: 'ADI-UB-UK9', size: 'UK 9', color: 'White', price: 11999, originalPrice: 14999, stock: 8, inStock: true },
      { id: 'v-ub-uk10-gry', sku: 'ADI-UB-UK10', size: 'UK 10', color: 'Grey', price: 11999, originalPrice: 14999, stock: 5, inStock: true },
    ],
  },
  {
    slug: 'genuine-leather-biker-jacket-men',
    name: 'Handcrafted Genuine Lambskin Leather Biker Jacket',
    description: 'Supple full-grain lambskin leather featuring asymmetric front zipper closure, quilted shoulder panels, and soft viscose interior lining.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    minPrice: 7999,
    maxPrice: 8999,
    variants: [
      { id: 'v-jk-m-blk', sku: 'JKT-LEA-M-BLK', size: 'M', color: 'Black', price: 7999, originalPrice: 12999, stock: 7, inStock: true },
      { id: 'v-jk-l-blk', sku: 'JKT-LEA-L-BLK', size: 'L', color: 'Black', price: 7999, originalPrice: 12999, stock: 11, inStock: true },
      { id: 'v-jk-xl-brn', sku: 'JKT-LEA-XL-BRN', size: 'XL', color: 'Brown', price: 8999, originalPrice: 13999, stock: 4, inStock: true },
    ],
  },
  {
    slug: 'chiffon-floral-maxi-dress-women',
    name: 'Women’s Elegant Floral Print Chiffon Maxi Evening Dress',
    description: 'Flowing lightweight chiffon with feminine V-neckline, subtle waist tie accent, and tiered ruffle hem.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    minPrice: 2499,
    maxPrice: 2499,
    variants: [
      { id: 'v-dr-s-beg', sku: 'DRS-FLR-S', size: 'S', color: 'Beige', price: 2499, originalPrice: 3999, stock: 15, inStock: true },
      { id: 'v-dr-m-beg', sku: 'DRS-FLR-M', size: 'M', color: 'Beige', price: 2499, originalPrice: 3999, stock: 20, inStock: true },
    ],
  },
  {
    slug: 'tailored-wool-blend-blazer',
    name: 'Men Slim-Fit Structured Wool-Blend Tailored Suit Blazer',
    description: 'Crisp Italian-inspired tailored blazer featuring notch lapels, flap pockets, and double back vents for modern formal sharpness.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    minPrice: 5999,
    maxPrice: 6499,
    variants: [
      { id: 'v-blz-40-nvy', sku: 'BLZ-WOOL-40', size: 'M', color: 'Navy', price: 5999, originalPrice: 8999, stock: 9, inStock: true },
      { id: 'v-blz-42-gry', sku: 'BLZ-WOOL-42', size: 'L', color: 'Grey', price: 6499, originalPrice: 9499, stock: 14, inStock: true },
    ],
  },
  {
    slug: 'rayban-wayfarer-classic-sunglasses',
    name: 'Ray-Ban Original Wayfarer Classic Sunglasses',
    description: 'Since 1952, the Wayfarer Classic has been a symbol of youth, fashion, and creativity. Features G-15 green polarized lenses.',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    minPrice: 7490,
    maxPrice: 7490,
    variants: [
      { id: 'v-sunglass-blk', sku: 'RB-WAY-BLK', size: 'Standard', color: 'Black', price: 7490, originalPrice: 8990, stock: 25, inStock: true },
    ],
  },

  // --- Home & Kitchen (5 items) ---
  {
    slug: 'smart-cast-iron-dutch-oven-pot',
    name: 'Enamel Coated Cast Iron Dutch Oven Pot with Lid',
    description: 'Superior heat distribution and retention for slow cooking, braising, baking sourdough bread, and roasting. Oven safe up to 500°F.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    minPrice: 3499,
    maxPrice: 4999,
    variants: [
      { id: 'v-pot-35-nvy', sku: 'POT-35-NAV', size: '3.5 Quart', color: 'Navy', price: 3499, originalPrice: 4999, stock: 14, inStock: true },
      { id: 'v-pot-55-blk', sku: 'POT-55-BLK', size: '5.5 Quart', color: 'Matte Black', price: 4499, originalPrice: 6999, stock: 7, inStock: true },
    ],
  },
  {
    slug: 'nespresso-vertuo-pop-coffee-machine',
    name: 'Nespresso Vertuo Pop Espresso & Coffee Pod Machine',
    description: 'Compact single-serve coffee maker utilizing Centrifusion technology to brew delicious espresso, double espresso, and coffee cups at touch of button.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebe02f2a698?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1517668808822-9ebe02f2a698?auto=format&fit=crop&w=800&q=80',
    minPrice: 12999,
    maxPrice: 12999,
    variants: [
      { id: 'v-nesp-blk', sku: 'NESP-VERT-BLK', size: 'Standard', color: 'Matte Black', price: 12999, originalPrice: 15999, stock: 11, inStock: true },
    ],
  },
  {
    slug: 'dyson-v15-detect-cordless-vacuum',
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    description: 'Intelligent cordless vacuum with laser illumination that reveals invisible dust on hard floors and automatically adapts suction power.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    minPrice: 62900,
    maxPrice: 62900,
    variants: [
      { id: 'v-dys-vac-gold', sku: 'DYS-V15-GLD', size: 'Standard', color: 'Gold', price: 62900, originalPrice: 69900, stock: 6, inStock: true },
    ],
  },
  {
    slug: 'instant-pot-duo-7in1-pressure-cooker',
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80',
    minPrice: 6999,
    maxPrice: 8999,
    variants: [
      { id: 'v-inst-6q', sku: 'INST-POT-6Q', size: '6 Quart', color: 'Stainless Steel', price: 6999, originalPrice: 8999, stock: 18, inStock: true },
      { id: 'v-inst-8q', sku: 'INST-POT-8Q', size: '8 Quart', color: 'Stainless Steel', price: 8999, originalPrice: 10999, stock: 9, inStock: true },
    ],
  },
  {
    slug: 'bamboo-sheets-king-bed-set',
    name: '100% Organic Bamboo Cooling Sheet Set - 400TC',
    description: 'Silkily soft, temperature-regulating bed sheets derived from organic bamboo viscose. Hypoallergenic and naturally moisture-wicking.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    minPrice: 2999,
    maxPrice: 3499,
    variants: [
      { id: 'v-sheet-wht-k', sku: 'BAMB-SHT-WHT-K', size: 'King Bed Set', color: 'White', price: 3499, originalPrice: 4999, stock: 24, inStock: true },
      { id: 'v-sheet-gry-k', sku: 'BAMB-SHT-GRY-K', size: 'King Bed Set', color: 'Grey', price: 3499, originalPrice: 4999, stock: 16, inStock: true },
    ],
  },

  // --- Beauty & Personal Care (3 items) ---
  {
    slug: 'hyaluronic-acid-hydrating-serum-50ml',
    name: 'Hydrating Hyaluronic Acid 2% + B5 Facial Serum',
    description: 'Deeply hydrating water-based serum that plumps skin, smoothes fine lines, and restores skin barrier resilience.',
    category: 'Beauty & Personal Care',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    minPrice: 499,
    maxPrice: 899,
    variants: [
      { id: 'v-serum-30ml', sku: 'HA-SERUM-30', size: '30 ml', color: 'Pure Hydration', price: 499, originalPrice: 699, stock: 60, inStock: true },
      { id: 'v-serum-50ml', sku: 'HA-SERUM-50', size: '50 ml', color: 'Pure Hydration', price: 699, originalPrice: 899, stock: 50, inStock: true },
    ],
  },
  {
    slug: 'dyson-airwrap-multi-styler-complete',
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    description: 'Curl, shape, smooth, and hide flyaways with no extreme heat. Uses Coanda airflow to style damp hair effortlessly.',
    category: 'Beauty & Personal Care',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    minPrice: 45900,
    maxPrice: 45900,
    variants: [
      { id: 'v-airwrap-copper', sku: 'DYS-AIR-COP', size: 'Standard', color: 'Copper', price: 45900, originalPrice: 49900, stock: 8, inStock: true },
      { id: 'v-airwrap-blue', sku: 'DYS-AIR-BLU', size: 'Standard', color: 'Sierra Blue', price: 45900, originalPrice: 49900, stock: 5, inStock: true },
    ],
  },
  {
    slug: 'japanese-damascus-chef-knife-8inch',
    name: 'Japanese 67-Layer Damascus Steel Chef Knife (8-inch)',
    description: 'Razor-sharp VG-10 cutting core encased in 67 layers of stainless Damascus steel with ergonomic G10 composite handle.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
    minPrice: 3899,
    maxPrice: 3899,
    variants: [
      { id: 'v-knife-8inch', sku: 'KNIFE-DAM-8', size: '8-inch Blade', color: 'Matte Black', price: 3899, originalPrice: 5999, stock: 21, inStock: true },
    ],
  },

  // --- Sports & Outdoors (3 items) ---
  {
    slug: 'high-density-anti-slip-yoga-mat',
    name: 'Eco-Friendly High-Density Anti-Slip TPE Yoga Mat',
    description: 'Dual-layer textured non-slip grip provides maximum cushion for joints, stability during poses, and light weight for studio travel.',
    category: 'Sports & Outdoors',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    minPrice: 1299,
    maxPrice: 1299,
    variants: [
      { id: 'v-mat-6mm-blk', sku: 'YOGA-MAT-BLK', size: '6mm Thickness', color: 'Black', price: 1299, originalPrice: 1999, stock: 35, inStock: true },
      { id: 'v-mat-6mm-nvy', sku: 'YOGA-MAT-NVY', size: '6mm Thickness', color: 'Navy', price: 1299, originalPrice: 1999, stock: 28, inStock: true },
    ],
  },
  {
    slug: 'insulated-stainless-water-bottle-1l',
    name: 'Vacuum Insulated Stainless Steel Water Bottle',
    description: 'Keeps beverages icy cold for up to 24 hours or piping hot for up to 12 hours. Sweat-proof powder-coated finish with leakproof straw lid.',
    category: 'Sports & Outdoors',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    minPrice: 699,
    maxPrice: 999,
    variants: [
      { id: 'v-bot-500-blk', sku: 'BTL-500-BLK', size: '500 ml', color: 'Black', price: 699, originalPrice: 999, stock: 42, inStock: true },
      { id: 'v-bot-1l-wht', sku: 'BTL-1L-WHT', size: '1 Litre', color: 'White', price: 899, originalPrice: 1299, stock: 30, inStock: true },
    ],
  },
  {
    slug: 'adjustable-quick-lock-dumbbells-set',
    name: 'Adjustable Dial Cast Iron Dumbbells Set (2.5kg to 24kg)',
    description: 'Replaces 15 sets of weights in one compact system. Smooth dial adjustment allows quick weight changes between exercises.',
    category: 'Sports & Outdoors',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    minPrice: 14999,
    maxPrice: 14999,
    variants: [
      { id: 'v-db-24k', sku: 'DUMBBELL-24K', size: '24 kg Set', color: 'Matte Black', price: 14999, originalPrice: 19999, stock: 10, inStock: true },
    ],
  },

  // --- Additional Products ---
  {
    slug: 'kindle-paperwhite-16gb-6.8inch',
    name: 'Amazon Kindle Paperwhite (6.8" Display, Warm Light)',
    description: 'Purpose-built for reading with a flush-front design and 300 ppi glare-free display that reads like real paper, even in direct sunlight.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    minPrice: 13999,
    maxPrice: 13999,
    variants: [
      { id: 'v-kind-16gb', sku: 'KIND-PAP-16', size: '16 GB', color: 'Black', price: 13999, originalPrice: 15999, stock: 25, inStock: true },
    ],
  },
  {
    slug: 'sony-playstation-5-console-slim',
    name: 'Sony PlayStation 5 Console (Slim Disc Edition)',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    minPrice: 54990,
    maxPrice: 54990,
    variants: [
      { id: 'v-ps5-disc', sku: 'PS5-SLIM-DISC', size: '1 TB SSD', color: 'White', price: 54990, originalPrice: 59990, stock: 7, inStock: true },
    ],
  },
  {
    slug: 'logitech-mx-master-3s-mouse',
    name: 'Logitech MX Master 3S Wireless Ergonomic Mouse',
    description: 'Quiet Click technology with 8K DPI tracking on any surface, MagSpeed electromagnetic scrolling, and customizable ergonomic thumb rest.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    minPrice: 9495,
    maxPrice: 9495,
    variants: [
      { id: 'v-logi-blk', sku: 'MX-MST-3S-BLK', size: 'Standard', color: 'Matte Black', price: 9495, originalPrice: 10995, stock: 30, inStock: true },
      { id: 'v-logi-gry', sku: 'MX-MST-3S-GRY', size: 'Standard', color: 'Grey', price: 9495, originalPrice: 10995, stock: 18, inStock: true },
    ],
  },
  {
    slug: 'organic-green-matcha-tea-powder-100g',
    name: 'Ceremonial Grade Organic Japanese Matcha Powder',
    description: '100% pure shade-grown Japanese green tea leaves ground into fine powder. Rich in L-Theanine and calm sustained energy without jitters.',
    category: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    minPrice: 799,
    maxPrice: 1299,
    variants: [
      { id: 'v-matcha-50g', sku: 'MATCHA-50G', size: '50 g', color: 'Ceremonial Grade', price: 799, originalPrice: 999, stock: 50, inStock: true },
      { id: 'v-matcha-100g', sku: 'MATCHA-100G', size: '100 g', color: 'Ceremonial Grade', price: 1299, originalPrice: 1699, stock: 40, inStock: true },
    ],
  },
  {
    slug: 'pure-silk-sleep-eye-mask',
    name: '100% Pure Mulberry Silk Luxury Sleep Eye Mask',
    description: 'Ultra-soft 22 Momme Mulberry Silk blocks out 100% light for deep restorative sleep while protecting delicate skin around eyes.',
    category: 'Beauty & Personal Care',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    minPrice: 899,
    maxPrice: 899,
    variants: [
      { id: 'v-mask-blk', sku: 'SILK-MSK-BLK', size: 'Standard', color: 'Black', price: 899, originalPrice: 1299, stock: 50, inStock: true },
      { id: 'v-mask-nvy', sku: 'SILK-MSK-NVY', size: 'Standard', color: 'Navy', price: 899, originalPrice: 1299, stock: 35, inStock: true },
    ],
  },
  {
    slug: 'air-purifier-hepa-filter-home',
    name: 'Smart True HEPA Air Purifier for Home (400 sq.ft)',
    description: '3-stage filtration system removes 99.97% of airborne particles, dust, pollen, pet dander, and odors with whisper-quiet sleep mode.',
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    minPrice: 8999,
    maxPrice: 8999,
    variants: [
      { id: 'v-airpur-wht', sku: 'AIR-PUR-WHT', size: '400 sq.ft Coverage', color: 'White', price: 8999, originalPrice: 11999, stock: 15, inStock: true },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log(`🌱 Seeding MongoDB Atlas database with ${SEED_PRODUCTS.length} distinct dynamic products...`);
    await connectDB();
    await ProductModel.deleteMany({}); // refresh product collection
    await ProductModel.insertMany(SEED_PRODUCTS);
    console.log(`✅ Successfully seeded ${SEED_PRODUCTS.length} distinct products into MongoDB Atlas!`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith('seedProducts.ts') || process.argv[1]?.endsWith('seedProducts.js')) {
  seedDatabase();
}
