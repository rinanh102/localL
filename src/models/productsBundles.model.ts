import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Products from "./products.model";
export interface ProductsBundleAttribute extends Model {
    id: number;
    productId: number;
    bundleId: number;
    quantity: number;
    status:number;
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
    bundleId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: STATUS.ACTIVE
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
class ProductsBundles extends Model<InferAttributes<ProductsBundleAttribute>, InferCreationAttributes<ProductsBundleAttribute>> {
    public id!: number;
    public productId!: number;
    public bundleId!: number;
    public quantity!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataGift = () => {
        const dataValue = this.get() as any;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
    }
}

ProductsBundles.init(init, {
    sequelize: DB,
    tableName: 'products_bundles',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

ProductsBundles.belongsTo(Products, { targetKey: 'id', as: 'product', foreignKey: 'productId' });

export default ProductsBundles;