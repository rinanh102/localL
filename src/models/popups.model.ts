import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { PopupType, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";


export interface PopupAttribute extends Model {
    id: number;
    title: string;
    content: string;
    type: PopupType;
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
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.DataTypes.ENUM(
            PopupType.REGISTER),
        allowNull: false,
        defaultValue: PopupType.REGISTER
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

class Popups extends Model<InferAttributes<PopupAttribute>, InferCreationAttributes<PopupAttribute>> {
    public id!: number;
    public title!: string;
    public content!: string;
    public type!: PopupType;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Popups.init(init, {
    sequelize: DB,
    tableName: 'popups',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default Popups;