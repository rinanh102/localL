import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Snacks from "./snacks.model";
import Files from "./files.model";
export interface SnackProductAttribute extends Model {
    id: number;
    snackId: number;
    productId: number;
    content: string;
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
    snackId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: STATUS.ACTIVE,
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

class SnackProducts extends Model<InferAttributes<SnackProductAttribute>, InferCreationAttributes<SnackProductAttribute>> {
    public id!: number;
    public snackId!: number;
    public productId!: number;
    public content!: string;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataSnackProduct = () => {
        const dataValue = this.get() as any;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

SnackProducts.init(init, {
    sequelize: DB,
    tableName: 'snacks_products',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
SnackProducts.belongsTo(Snacks, {targetKey: 'id', as: 'snack', foreignKey: 'snackId' });

export default SnackProducts;