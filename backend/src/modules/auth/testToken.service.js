import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-dev-secret-key";

export function generateTestToken(role) {
  if (!["admin", "business"].includes(role)) {
    throw new Error("Invalid role. Must be admin or business");
  }
  // Generate token with all role claim formats your auth middleware expects
  const payload = {
    sub: "4e9481c1-2b33-4c02-90b0-961052ca20dd", // Random user/business UUID
    // sub: uuidv4(), // Random user/business UUID
    business_id:
      role === "business" ? "4e9481c1-2b33-4c02-90b0-961052ca20dd" : undefined, // For business users
    // business_id: role === 'business' ? uuidv4() : undefined, // For business users
    roles: [role], // Array format
    role, // Single role format
    "https://roles": [role], // Auth0/external provider format
    aud: config.jwt.audience,
    iss: config.jwt.issuer,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" });
}
