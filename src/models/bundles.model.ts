import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS, RECOMMNED } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
import Products from "./products.model";
import ProductsBundles from "./productsBundles.model";
import Regions from "./regions.model";
export interface BundleAttribute extends Model {
    id: number;
    title: string;
    price: number;
    url: string;
    region: number;
    description: string;
    brewery: string;
    discount: number;
    totalLike: number;
    totalClick: number;
    concentration: number;
    isRecommend: number;
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
        type: Sequelize.DataTypes.INTEGER,
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
        allowNull: false,
        defaultValue: 0
    },
    concentration: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
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

class Bundles extends Model<InferAttributes<BundleAttribute>, InferCreationAttributes<BundleAttribute>> {
    public id!: number;
    public title!: string;
    public price!: number;
    public url!: string;
    public region!: number;
    public description!: string;
    public brewery!: string;
    public discount!: number;
    public totalLike!: number;
    public totalClick!: number;
    public concentration!: number;
    public isRecommend!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataGiftList = () => {
        const dataValue = this.get() as any;
        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrl());

        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        dataValue.images = images;
        delete dataValue.imageURLs;
        delete dataValue.region;
        delete dataValue.description;
        delete dataValue.brewery;
        delete dataValue.concentration;
        delete dataValue.isRecommend;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;

        return dataValue;
    }
    public toDataGiftDetail = () => {
        const dataValue = this.get() as any;

        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrl());
        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            const url = a.url || '';
            if (!!url) {
                r[key].push(url);
            }
            return r;
        }, Object.create(null));

        const products = dataValue.product_bundle.map((item: any) => {
            const product = item.product;

            return {
                ...product.dataValues,
                quantity: item.quantity
            }
        });
        dataValue.products = products;
        dataValue.images = images;
        dataValue.region = dataValue.regions?.name;
        dataValue.district = dataValue.districts?.name;
        delete dataValue.product_bundle;
        delete dataValue.imageURLs;
        delete dataValue.regions;
        delete dataValue.districts;
        delete dataValue.description;
        delete dataValue.brewery;
        delete dataValue.concentration;
        delete dataValue.isRecommend;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;

        return dataValue;
    }

    public toDataGiftDetailAdmin = () => {
        const dataValue = this.get() as any;
        const imageUrls = dataValue.imageURLs.map((data: any) => data.toDataImageUrlAdmin());
        const images = imageUrls.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));

        const products = dataValue.product_bundle.map((item: any) => {
            const product = item.product;
            return {
                ...product.dataValues,
                quantity: item.quantity
            }
        });

        dataValue.products = products;
        dataValue.images = images;
        delete dataValue.product_bundle;
        delete dataValue.imageURLs;
        delete dataValue.region;
        delete dataValue.description;
        delete dataValue.brewery;
        delete dataValue.concentration;
        delete dataValue.isRecommend;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;

        return dataValue;
    }

    public toDataGiftDetailAdminDashboard = () => {
        const dataValue = this.get() as any;
        const products = dataValue.product_bundle.map((item: any) => {
            const product = item.product;
            return {
                ...product.dataValues,
                quantity: item.quantity
            }
        });
        dataValue.products = products;
        delete dataValue.product_bundle;
        delete dataValue.imageURLs;
        delete dataValue.region;
        delete dataValue.description;
        delete dataValue.brewery;
        delete dataValue.concentration;
        delete dataValue.isRecommend;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;

        return dataValue;
    }
}

Bundles.init(init, {
    sequelize: DB,
    tableName: 'bundles',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
Bundles.hasMany(Files, { sourceKey: "id", as: 'imageURLs', foreignKey: 'bundleId' });
Bundles.belongsToMany(Products, { sourceKey: "id", as: 'products', through: 'products_bundles', foreignKey: 'bundleId' });
Bundles.hasMany(ProductsBundles, { sourceKey: "id", as: 'product_bundle', foreignKey: 'bundleId' });
Bundles.belongsTo(Regions, { targetKey: "id", as: 'regions', foreignKey: 'region' });

export default Bundles;