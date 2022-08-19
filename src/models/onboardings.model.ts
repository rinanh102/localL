import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
export interface OnboardingAttribute extends Model {
    id: number;
    title: string;
    subTitle: string;
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
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    subTitle: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
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

class Onboardings extends Model<InferAttributes<OnboardingAttribute>, InferCreationAttributes<OnboardingAttribute>> {
    public id!: number;
    public title!: string;
    public subTitle!: string;
    public image!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataOnboardings = () => {
        const dataValue = this.get() as any;
        dataValue.image = dataValue.imageUrl?.url;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.imageUrl;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
    public toDataOnboardingAdmin = () => {
        const dataValue = this.get() as any;

        dataValue.imageId = dataValue.imageUrl?.id;
        dataValue.imageName = dataValue.imageUrl?.name;
        dataValue.url = dataValue.imageUrl?.url;

        delete dataValue.image;
        delete dataValue.title;
        delete dataValue.subTitle;
        delete dataValue.imageUrl;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Onboardings.init(init, {
    sequelize: DB,
    tableName: 'onboardings',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

Onboardings.belongsTo(Files, { targetKey: "id", as: 'imageUrl', foreignKey: 'image' });

export default Onboardings;