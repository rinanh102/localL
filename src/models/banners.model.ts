import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { BannerType, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";

export interface BannerAttribute extends Model {
    id: number; 
    title: string;
    subTitle: string;
    image: number;
    url: string;
    type: BannerType;
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
        allowNull: true
    },
    subTitle: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: Sequelize.DataTypes.ENUM(
            BannerType.PROMOTION, 
            BannerType.SEARCH),
        allowNull: false,
        defaultValue: BannerType.PROMOTION
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

class Banners extends Model<InferAttributes<BannerAttribute>, InferCreationAttributes<BannerAttribute>> {
    public id!: number;
    public title!: string;
    public subTitle!: string;
    public image!: number;
    public url!: string;
    public type!: BannerType;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataTitle = () => {
        const dataValue = this.get() as any;
        delete dataValue.id;
        delete dataValue.image;
        delete dataValue.url;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataBanner = () => {
        const dataValue = this.get() as any;
        dataValue.image = dataValue.imageUrl?.url;
        delete dataValue.id;
        delete dataValue.subTitle;
        delete dataValue.imageUrl;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataBannerAdmin = () => {
        const dataValue = this.get() as any;

        dataValue.imageId = dataValue.imageUrl?.id;
        dataValue.imageName = dataValue.imageUrl?.name;
        dataValue.imageUrl = dataValue.imageUrl?.url;

        delete dataValue.image;
        delete dataValue.subTitle;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Banners.init(init, {
    sequelize: DB,
    tableName: 'banners',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id', 'type']
    }]
});

Banners.belongsTo(Files, { targetKey: "id", as: "imageUrl", foreignKey: "image"});

export default Banners;