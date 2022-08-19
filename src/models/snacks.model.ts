import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
export interface SnackAttribute extends Model {
    id: number;
    name: string;
    image: number;
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
    image: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
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

class Snacks extends Model<InferAttributes<SnackAttribute>, InferCreationAttributes<SnackAttribute>> {
    public id!: number;
    public name!: string;
    public image!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toSnackAdminList = () => {
        const dataValue = this.get() as any;
        dataValue.image = {
            url : dataValue.imageUrl.url,
            id : dataValue.imageUrl.id,
            name : dataValue.imageUrl.name,
        }
        delete dataValue.imageUrl;
        return dataValue;
    }
}

Snacks.init(init, {
    sequelize: DB,
    tableName: 'snacks',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
Snacks.belongsTo(Files, { targetKey: "id", as: "imageUrl", foreignKey: "image"});

export default Snacks;