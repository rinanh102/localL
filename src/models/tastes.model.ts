import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
export interface TasteAttribute extends Model {
    id: number;
    name: string;
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
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
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

class Tastes extends Model<InferAttributes<TasteAttribute>, InferCreationAttributes<TasteAttribute>> {
    public id!: number;
    public name!: string;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Tastes.init(init, {
    sequelize: DB,
    tableName: 'tastes',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default Tastes;