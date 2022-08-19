import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Categories from "./categories.model";
import Products from "./products.model";
export interface ProductsCategoryAttribute extends Model {
    id: number;
    productId: number;
    categoryId: number;
    status:number;
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
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    categoryId: {
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
class ProductsCategories extends Model<InferAttributes<ProductsCategoryAttribute>, InferCreationAttributes<ProductsCategoryAttribute>> {
    public id!: number;
    public productId!: number;
    public categoryId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataCategoryProduct = () => {
        const dataValue = this.get() as any;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

ProductsCategories.init(init, {
    sequelize: DB,
    tableName: 'products_categories',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
ProductsCategories.belongsTo(Categories, {targetKey: 'id', as: 'category', foreignKey: 'categoryId' })

export default ProductsCategories;