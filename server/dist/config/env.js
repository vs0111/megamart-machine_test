"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
exports.config = {
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGO_URI || 'mongodb+srv://vishnusureshevs_db_user:CbVTdlb2cUm16fcU@cluster0.iq365u3.mongodb.net/megamart?retryWrites=true&w=majority',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_megamart_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    nodeEnv: process.env.NODE_ENV || 'development',
};
