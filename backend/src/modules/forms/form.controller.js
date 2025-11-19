import { getKycFormConfiguration } from "./form.service.js";

export async function getKycFormConfig(req, res, next) {
  try {
    const { marketCode } = req.params;
    const config = await getKycFormConfiguration(marketCode);

    if (!config) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Market not found" },
      });
    }

    return res.json({
      market: config.market,
      steps: config.steps,
    });
  } catch (e) {
    return next(e);
  }
}
