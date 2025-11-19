import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import config from "../../config/index.js";

const client = config.jwt.jwksUri
  ? jwksClient({
      jwksUri: config.jwt.jwksUri,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000,
    })
  : null;

function getKey(header, callback) {
  if (!client) return callback(new Error("JWKS not configured"));
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    return callback(null, signingKey);
  });
}

export function requireAuth(optional = false) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    // Dev bypass
    if (
      !token &&
      optional &&
      process.env.NODE_ENV === "development" &&
      req.headers["x-dev-user"]
    ) {
      try {
        const fake = JSON.parse(req.headers["x-dev-user"]);
        req.user = fake;
        return next();
      } catch (e) {
        // ignore
      }
    }

    if (!token) {
      if (optional) return next();
      return res
        .status(401)
        .json({ error: { code: "UNAUTHORIZED", message: "Missing token" } });
    }

    const verifyOptions = {
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      algorithms: ["RS256", "HS256"],
    };

    if (client) {
      jwt.verify(token, getKey, verifyOptions, (err, decoded) => {
        if (err)
          return res
            .status(401)
            .json({
              error: { code: "UNAUTHORIZED", message: "Invalid token" },
            });
        req.user = decoded;
        return next();
      });
    } else {
      // HS256 fallback for local if JWT_SECRET provided
      const secret = process.env.JWT_SECRET;
      if (!secret)
        return res
          .status(500)
          .json({
            error: { code: "SERVER_ERROR", message: "Auth not configured" },
          });
      try {
        const decoded = jwt.verify(token, secret, verifyOptions);
        req.user = decoded;
        return next();
      } catch (e) {
        return res
          .status(401)
          .json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
      }
    }
  };
}
