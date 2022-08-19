import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Users from "./users.model";
export interface ProductLikeAttribute extends Model {
    id: number;
    userId: number;
    productId: number;
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
    userId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: STATUS.ACTIVE
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE()
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE()
    },
}

class ProductLikes extends Model<InferAttributes<ProductLikeAttribute>, InferCreationAttributes<ProductLikeAttribute>> {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ProductLikes.init(init, {
    sequelize: DB,
    tableName: 'products_likes',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
ProductLikes.belongsTo(Users, { targetKey: "id", as: 'user', foreignKey: 'userId' });

export default ProductLikes;