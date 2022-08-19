import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";

export interface DeviceSessionAttribute extends Model {
    id: number;
    deviceToken: string;
    userId: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

const init = {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true
    },
    deviceToken: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
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

class DeviceSessions extends Model<InferAttributes<DeviceSessionAttribute>, InferCreationAttributes<DeviceSessionAttribute>> {
    public id!: number;
    public deviceToken!: string;
    public userId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

DeviceSessions.init(init, {
    sequelize: DB,
    tableName: 'device_session',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default DeviceSessions;