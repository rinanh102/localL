import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";

export interface RegionAttribute extends Model {
    id: number;
    name: string;
    splitName: string;
    parentId: number;
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
        allowNull: false,
    },
    splitName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    parentId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: STATUS.ACTIVE
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE(),
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE(),
    },
}

class Regions extends Model<InferAttributes<RegionAttribute>, InferCreationAttributes<RegionAttribute>> {
    public id!: number;
    public name!: string;
    public splitName!: string;
    public parentId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataRegion = () => {
        const dataValue = this.get() as any;
        delete dataValue.parentId;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataDistrict = () => {
        const dataValue = this.get() as any;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Regions.init(init, {
    sequelize: DB,
    tableName: 'regions',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default Regions;