import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://vishnusureshevs_db_user:CbVTdlb2cUm16fcU@cluster0.iq365u3.mongodb.net/megamart?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_megamart_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
};
