import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { HIGH_LIGHT, STATUS } from "../utils/const";
import { RECOMMNED } from "../utils/const";
import { DB } from "../libs/mysql";
import KeyWordProducts from "./keywordProducts.model";
import TasteEvaluations from "./tasteEvaluation.model";
import SnackProducts from "./snacksProducts.model";
import ProductsCategories from "./productsCategories.model";
import Keywords from "./keywords.model";
import Tastes from "./tastes.model";
import Snacks from "./snacks.model";
import Categories from "./categories.model";
import Regions from "./regions.model";
import Files from "./files.model";
import ProductLikes from "./productsLikes.model";
import Users from "./users.model";
import Reviews from "./reviews.model";
export interface ProductAttribute extends Model {
    id: number;
    title: string;
    price: number;
    url: string;
    region: number;
    district: number;
    description: string;
    totalLike: number;
    totalClick: number;
    brewery: string;
    discount: number;
    concentration: number;
    isRecommend: number;
    quantity: number;
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
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DataTypes.DOUBLE.UNSIGNED,
        allowNull: false
    },
    url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
    },
    district: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
    },
    description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    brewery: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    discount: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    quantity: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
    },
    concentration: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    isRecommend: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: RECOMMNED.FALSE
    },
    totalLike: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    totalClick: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
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

class Products extends Model<InferAttributes<ProductAttribute>, InferCreationAttributes<ProductAttribute>> {
    public id!: number;
    public title!: string;
    public price!: number;
    public url!: string;
    public region!: number;
    public district!: number;
    public description!: string;
    public brewery!: string;
    public discount!: number;
    public totalLike!: number;
    public totalClick!: number;
    public quantity!: number;
    public concentration!: number;
    public isRecommend!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toProductIsRecommend = () => {
        const dataValue = this.get() as any;
        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrl());

        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        const keywords = dataValue.keyword_product?.map((item: any) => {
            const keyword = item.keyword;
            return {
                id: keyword.id,
                content: keyword.content,
                highlight: item.highlight === HIGH_LIGHT.ON ? true : false
            }
        });
        const categoriesFilter = dataValue.product_categories.map((item: any) => {
            const category = item.category;
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
            }
        });

        dataValue.isLike = !!dataValue.isLike;

        dataValue.keywords = keywords;
        dataValue.region = dataValue.regions.name;
        dataValue.district = dataValue.districts.name;
        dataValue.category = categoriesFilter;
        dataValue.images = images

        delete dataValue.productLike;
        delete dataValue.imageURLs;
        delete dataValue.product_categories;
        delete dataValue.regions;
        delete dataValue.districts;
        delete dataValue.keyword_product;
        delete dataValue.updatedAt;
        delete dataValue.status;
        return dataValue;
    }

    public toDataProductDetail = () => {
        const dataValue = this.get() as any;
        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrl());
        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        const keywords = dataValue.keyword_product?.map((item: any) => {
            const keyword = item.keyword;
            return {
                id: keyword.id,
                content: keyword.content,
                highlight: item.highlight === HIGH_LIGHT.ON ? true : false
            }
        });
        const sortedKeywords = [];
        for(let i = 0; i < keywords.length; i++ ){
            if(keywords[i].highlight) {
                sortedKeywords.unshift(keywords[i]);
            } else {
                sortedKeywords.push(keywords[i]);
            }
        }

        const tastes = dataValue.taste_evaluations?.map((item: any) => {
            const taste = item.taste;
            return {
                id: taste.id,
                name: taste.name,
                score: item.score
            }
        });
        const snacks = dataValue.snack_product?.map((item: any) => {
            const snack = item.snack;
            return {
                id: snack.id,
                name: snack.name,
                content: item.content,
                image: snack.imageUrl.url
            }
        });
        const categoriesFilter = dataValue.product_categories.map((item: any) => {
            const category = item.category;
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
            }
        });
        const categories = categoriesFilter.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));
        dataValue.isLike = !!dataValue.isLike;

        dataValue.keywords = sortedKeywords;
        dataValue.tastes = tastes;
        dataValue.snacks = snacks;
        dataValue.category = categories;
        dataValue.region = dataValue.regions.name;
        dataValue.district = dataValue.districts.name;
        dataValue.images = images
       
        delete dataValue.sortedKeywords;
        delete dataValue.productLike;
        delete dataValue.keyword_product;
        delete dataValue.taste_evaluations;
        delete dataValue.snack_product;
        delete dataValue.product_categories;
        delete dataValue.imageURLs;
        delete dataValue.regions;
        delete dataValue.districts;
        delete dataValue.updatedAt;
        delete dataValue.createdAt;
        delete dataValue.status;
        return dataValue;
    }

    public toDetailAdmin = () => {
        const dataValue = this.get() as any;

        const keywords = dataValue.keyword_product.map((item: any) => {
            const keyword = item.keyword;
            return {
                id: keyword.id,
                content: keyword.content,
                highlight: item.highlight === HIGH_LIGHT.ON ? true : false
            }
        });

        const tastes = dataValue.taste_evaluations.map((item: any) => {
            const taste = item.taste;
            return {
                id: taste.id,
                name: taste.name,
                score: item.score
            }
        });
        const snacks = dataValue.snack_product.map((item: any) => {
            const snack = item.snack;
            return {
                id: snack.id,
                name: snack.name,
                content: item.content
            }
        });
        const categoriesFilter = dataValue.product_categories.map((item: any) => {
            const category = item.category;
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
            }
        });
        const categories = categoriesFilter.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrlAdmin());
        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        dataValue.keywords = keywords;
        dataValue.tastes = tastes;
        dataValue.snacks = snacks;
        dataValue.category = categories;
        dataValue.region = dataValue.regions;
        dataValue.district = dataValue.districts;
        dataValue.images = images;

        delete dataValue.imageURLs;
        delete dataValue.keyword_product;
        delete dataValue.taste_evaluations;
        delete dataValue.snack_product;
        delete dataValue.product_categories;
        delete dataValue.regions;
        delete dataValue.districts;
        delete dataValue.updatedAt;
        delete dataValue.status;
        return dataValue;
    }

    public toDetailAdminDashboard = () => {
        const dataValue = this.get() as any;

        const keywords = dataValue.keyword_product.map((item: any) => {
            const keyword = item.keyword;
            return {
                id: keyword.id,
                content: keyword.content,
                highlight: item.highlight === HIGH_LIGHT.ON ? true : false
            }
        });
        const tastes = dataValue.taste_evaluations.map((item: any) => {
            const taste = item.taste;
            return {
                id: taste.id,
                name: taste.name,
                score: item.score
            }
        });
        const categoriesFilter = dataValue.product_categories.map((item: any) => {
            const category = item.category;
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
            }
        });
        const categories = categoriesFilter.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        dataValue.keywords = keywords;
        dataValue.tastes = tastes;
        dataValue.category = categories;
        dataValue.region = dataValue.regions;
        dataValue.district = dataValue.districts;

        delete dataValue.keyword_product;
        delete dataValue.taste_evaluations;
        delete dataValue.product_categories;
        delete dataValue.keyword_product;
        delete dataValue.url;
        delete dataValue.totalLike;
        delete dataValue.totalClick;
        delete dataValue.isRecommend;
        delete dataValue.regions;
        delete dataValue.districts;
        delete dataValue.updatedAt;
        delete dataValue.status;
        return dataValue;
    }

}

Products.init(init, {
    sequelize: DB,
    tableName: 'products',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

Products.hasMany(KeyWordProducts, { sourceKey: "id", as: 'keyword_product', foreignKey: 'productId' })
Products.hasMany(TasteEvaluations, { sourceKey: "id", as: 'taste_evaluations', foreignKey: 'productId' })
Products.hasMany(SnackProducts, { sourceKey: "id", as: 'snack_product', foreignKey: 'productId' })
Products.hasMany(ProductsCategories, { sourceKey: "id", as: 'product_categories', foreignKey: 'productId' })
Products.belongsToMany(Keywords, { sourceKey: "id", as: "keywords", through: "keywords_products", foreignKey: "productId" });
Products.belongsToMany(Tastes, { sourceKey: "id", as: "tastes", through: "taste_evaluation", foreignKey: "productId" })
Products.belongsToMany(Snacks, { sourceKey: "id", as: "snacks", through: "snacks_products", foreignKey: "productId" })
Products.belongsToMany(Categories, { sourceKey: "id", as: "categories", through: "products_categories", foreignKey: "productId" })
Products.belongsTo(Regions, { targetKey: "id", as: 'regions', foreignKey: 'region' });
Products.belongsTo(Regions, { targetKey: "id", as: 'districts', foreignKey: 'district' });
Products.hasMany(Files, { sourceKey: "id", as: 'imageURLs', foreignKey: 'productId' });
Products.hasMany(ProductLikes, { sourceKey: "id", as: "productLike", foreignKey: "productId" })

export default Products;