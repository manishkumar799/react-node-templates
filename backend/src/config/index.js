import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: Number(process.env.APP_PORT || 3000),
    env: process.env.NODE_ENV || "development",
  },
  log: {
    level: process.env.LOG_LEVEL || "info",
  },
  db: {
    url: process.env.DATABASE_URL,
    poolMin: Number(process.env.DB_POOL_MIN || 2),
    poolMax: Number(process.env.DB_POOL_MAX || 10),
  },
  jwt: {
    jwksUri:
      process.env.NODE_ENV === "development" ? null : process.env.JWT_JWKS_URI,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  },
  upload: {
    maxSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10),
  },
};

export default config;
