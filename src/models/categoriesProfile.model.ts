import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Categories from "./categories.model";
export interface CategoryProfileAttribute extends Model {
    id: number;
    userId: number;
    categoryId: number;
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
    categoryId: {
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

class CategoryProfiles extends Model<InferAttributes<CategoryProfileAttribute>, InferCreationAttributes<CategoryProfileAttribute>> {
    public id!: number;
    public userId!: number;
    public categoryId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

CategoryProfiles.init(init, {
    sequelize: DB,
    tableName: 'categories_profile',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

CategoryProfiles.belongsTo(Categories, {targetKey: 'id', as: 'category', foreignKey: 'categoryId' })

export default CategoryProfiles;