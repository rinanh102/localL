import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { HIGH_LIGHT, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Keywords from "./keywords.model";
export interface KeyWordProductAttribute extends Model {
    id: number;
    productId: number;
    keywordId: number;
    highlight: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

const init = {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.DataTypes.BIGINT(),
        autoIncrement: true
    },
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    keywordId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: STATUS.ACTIVE
    },
    highlight: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: HIGH_LIGHT.OFF
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE()
    },
    updatedAt: {
        allowNull: true,
        type: Sequelize.DataTypes.DATE()
    },
}
class KeyWordProducts extends Model<InferAttributes<KeyWordProductAttribute>, InferCreationAttributes<KeyWordProductAttribute>> {
    public id!: number;
    public productId!: number;
    public keywordId!: number;
    public status!: number;
    public highlight!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

KeyWordProducts.init(init, {
    sequelize: DB,
    tableName: 'keywords_products',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

KeyWordProducts.belongsTo(Keywords, {targetKey: 'id', as: 'keyword', foreignKey: 'keywordId' })

export default KeyWordProducts;