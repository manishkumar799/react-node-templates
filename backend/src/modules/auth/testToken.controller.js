import { generateTestToken } from "./testToken.service.js";

export async function getTestToken(req, res, next) {
  try {
    const { role } = req.query;
    if (!role || !["admin", "business"].includes(role)) {
      return res.status(400).json({
        error: {
          code: "INVALID_ROLE",
          message:
            "Role query parameter required. Use ?role=admin or ?role=business",
        },
      });
    }

    const token = generateTestToken(role);

    return res.json({
      token,
      role,
      expires_in: "24 hours",
      usage: `Authorization: Bearer ${token}`,
      note: "Test token for development/testing only",
    });
  } catch (e) {
    return next(e);
  }
}

export async function getTokenInfo(req, res) {
  return res.json({
    message: "Test token generation for KYC API testing",
    endpoints: {
      "GET /test/token?role=business": "Generate business user token",
      "GET /test/token?role=admin": "Generate admin user token",
    },
    usage: "Include token in Authorization header: Bearer <token>",
    note: "Available in development environment only",
  });
}
