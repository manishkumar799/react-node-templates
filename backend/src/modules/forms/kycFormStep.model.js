import { DataTypes, sequelize } from '../../common/dal/index.js';
import { Market } from '../markets/market.model.js';

export const KycFormStep = sequelize.define('kyc_form_step', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  market_id: { type: DataTypes.UUID, allowNull: false },
  step_number: { type: DataTypes.INTEGER, allowNull: false },
  step_key: { type: DataTypes.STRING(50), allowNull: false },
  step_title: { type: DataTypes.STRING(200), allowNull: false },
  step_description: { type: DataTypes.TEXT },
  is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
  display_order: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  version: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { tableName: 'kyc_form_steps' });

Market.hasMany(KycFormStep, { foreignKey: 'market_id' });
KycFormStep.belongsTo(Market, { foreignKey: 'market_id' });
