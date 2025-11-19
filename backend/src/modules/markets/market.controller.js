import * as svc from "./market.service.js";

export async function getRequirements(req, res, next) {
  try {
    const { marketCode } = req.params;
    const market = await svc.getMarketByCode(marketCode);
    if (!market)
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Market not found" } });
    const docs = await svc.listDocumentTypes(market.id);
    return res.json({ market, requirements: docs });
  } catch (e) {
    return next(e);
  }
}

export async function adminListMarkets(req, res, next) {
  try {
    const markets = await svc.listMarkets();
    return res.json({ data: markets });
  } catch (e) {
    return next(e);
  }
}

export async function adminCreateMarket(req, res, next) {
  try {
    const created = await svc.createMarket(req.body);
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
}

export async function adminListDocTypes(req, res, next) {
  try {
    const { marketId } = req.params;
    const items = await svc.listDocumentTypes(marketId);
    return res.json({ data: items });
  } catch (e) {
    return next(e);
  }
}

export async function adminUpsertDocType(req, res, next) {
  try {
    const { marketId } = req.params;
    const item = await svc.upsertDocumentType(marketId, req.body);
    return res.status(201).json(item);
  } catch (e) {
    return next(e);
  }
}
