import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
import Users from "./users.model";
import ReviewLikes from "./reviewsLikes.model";
import Products from "./products.model";
export interface ReviewAttribute extends Model {
    id: number;
    content: string;
    productId: number;
    userId: number;
    totalLike: number;
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
    content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    totalLike: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
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

class Reviews extends Model<InferAttributes<ReviewAttribute>, InferCreationAttributes<ReviewAttribute>> {
    public id!: number;
    public content!: string;
    public productId!: number;
    public userId!: number;
    public talLike!: number;
    public image!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataReview = () => {
        const dataValue = this.get() as any;
        if (dataValue.imageUrl)  dataValue.image = dataValue.imageUrl.url;

        dataValue.isLike = !!dataValue.isLike;

        dataValue.author = dataValue.user.name;
        delete dataValue.reviewLike;
        delete dataValue.userId;
        delete dataValue.imageUrl;
        delete dataValue.user;
        delete dataValue.status;
        delete dataValue.updatedAt;
        return dataValue;

    }

    public toDataDashBoard = () => {
        const dataValue = this.get() as any;
        const author = dataValue?.user?.name;
        dataValue.author = author;
        delete dataValue.productId;
        delete dataValue.userId;
        delete dataValue.totalLike;
        delete dataValue.image;
        delete dataValue.status;
        delete dataValue.updatedAt;
        delete dataValue.user;
        return dataValue;
    }

    public toDetailReviewAdmin = () => {
        const dataValue = this.get() as any;
        if (dataValue.imageUrl)  dataValue.image = dataValue.imageUrl.url;

        dataValue.productName = dataValue.product.title;
        dataValue.author = dataValue.user.name;
        delete dataValue.reviewLike;
        delete dataValue.productId;
        delete dataValue.product;
        delete dataValue.imageUrl;
        delete dataValue.user;
        delete dataValue.status;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Reviews.init(init, {
    sequelize: DB,
    tableName: 'reviews',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
Reviews.belongsTo(Users, { targetKey: "id", as: 'user', foreignKey: 'userId' });
Reviews.belongsTo(Files, { targetKey: "id", as: "imageUrl", foreignKey: "image"});
Reviews.hasMany(ReviewLikes, { sourceKey: "id", as: "reviewLike", foreignKey: "reviewId" })
Reviews.belongsTo(Products, { targetKey: "id", as: "product", foreignKey: "productId"});

export default Reviews;