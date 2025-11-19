export default function rbac(requiredRole) {
  return (req, res, next) => {
    const roles =
      (req.user &&
        (req.user.roles || req.user.role || req.user["https://roles"] || [])) ||
      [];
    const has = Array.isArray(roles)
      ? roles.includes(requiredRole)
      : roles === requiredRole;
    if (!has) {
      return res
        .status(403)
        .json({ error: { code: "FORBIDDEN", message: "Insufficient role" } });
    }
    return next();
  };
}
