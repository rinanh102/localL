import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { BannerCategoryType, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";

export interface CategoryAttribute extends Model {
    id: number;
    name: string;
    description: string;
    type: BannerCategoryType;
    order: number;
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
    description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: Sequelize.DataTypes.ENUM(
            BannerCategoryType.CATEGORIES,
            BannerCategoryType.AGE,
            BannerCategoryType.CONCENTRATION,
            BannerCategoryType.GENDER,
            BannerCategoryType.PRICE,
            BannerCategoryType.TARGET,
            BannerCategoryType.PURPOSE,
            BannerCategoryType.STYLE
        ),
        allowNull: false,
        defaultValue: BannerCategoryType.CATEGORIES
    },
    order: {
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

class Categories extends Model<InferAttributes<CategoryAttribute>, InferCreationAttributes<CategoryAttribute>> {
    public id!: number;
    public name!: string;
    public description!: string;
    public type!: BannerCategoryType;
    public order: number;
    public status: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toCateTabData = () => {
        const dataValue = this.get() as any;
        delete dataValue.order;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Categories.init(init, {
    sequelize: DB,
    tableName: 'categories',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default Categories;