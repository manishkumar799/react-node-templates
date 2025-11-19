import marketRoutes from "../modules/markets/market.routes.js";
import formRoutes from "../modules/forms/form.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";
import submissionRoutes from "../modules/submissions/submission.routes.js";
import testTokenRoutes from "../modules/auth/testToken.routes.js";

export default function routes(app) {
  app.use("/markets", marketRoutes);
  app.use("/markets", formRoutes);
  app.use("/admin", adminRoutes);
  app.use("/documents", documentRoutes);
  app.use("/kyc", submissionRoutes);

  // Only enable in development
  if (process.env.NODE_ENV === "development") {
    app.use("/test", testTokenRoutes); // Add this
  }
}
