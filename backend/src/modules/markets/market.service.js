import { Market } from "./market.model.js";
import { KycDocumentType } from "./documentType.model.js";

export async function getMarketByCode(code) {
  return Market.findOne({ where: { code } });
}

export async function listMarkets() {
  return Market.findAll({ order: [["code", "ASC"]] });
}

export async function createMarket(data) {
  return Market.create(data);
}

export async function listDocumentTypes(marketId) {
  return KycDocumentType.findAll({
    where: { market_id: marketId, active: true },
    order: [["code", "ASC"]],
  });
}

export async function upsertDocumentType(marketId, payload) {
  const existing = await KycDocumentType.findOne({
    where: { market_id: marketId, code: payload.code, active: true },
  });
  if (!existing) {
    return KycDocumentType.create({
      ...payload,
      market_id: marketId,
      version: 1,
    });
  }
  // Simple version bump: deactivate old, create new version
  await existing.update({ active: false });
  const nextVersion = existing.version + 1;
  return KycDocumentType.create({
    ...existing.toJSON(),
    ...payload,
    id: undefined,
    active: true,
    version: nextVersion,
    market_id: marketId,
  });
}
