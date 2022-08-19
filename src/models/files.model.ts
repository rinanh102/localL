import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { FileType, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
export interface FileAttribute extends Model {
    id: number;
    name: string;
    type: string;
    url: string;
    key: string;
    status: number;
    ownerId: number;
    productId: number;
    bundleId: string;
    order: number;
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
    type: {
        type: Sequelize.DataTypes.ENUM(
            FileType.ALCOHOLICS,
            FileType.BANNERS,
            FileType.CATEGORIES,
            FileType.COMMENTS,
            FileType.ICONS,
            FileType.ONBOARDINGS,
            FileType.PRODUCTS,
            FileType.REVIEWS,
            FileType.SPLASHS,
            FileType.AVATARS,
            FileType.THUMBNAILS
        ),
        allowNull: false,
        defaultValue: FileType.ALCOHOLICS
    },
    key: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: STATUS.ACTIVE
    },
    ownerId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    bundleId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    order: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
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

class Files extends Model<InferAttributes<FileAttribute>, InferCreationAttributes<FileAttribute>> {
    public id!: number;
    public name!: string;
    public type!: FileType;
    public key!: string;
    public url!: string;
    public status!: number;
    public ownerId!: number;
    public productId!: number;
    public bundleId!: number;
    public order!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toFileDataUrl = () => {
        return this.getDataValue('url');
    }

    public toDataImageUrl = () => {
        const dataValue = this.get() as any;
        delete dataValue.status;
        delete dataValue.ownerId;
        delete dataValue.key;
        delete dataValue.productId;
        delete dataValue.bundleId;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataImageUrlAdmin = () => {
        const dataValue = this.get() as any;
        delete dataValue.status;
        delete dataValue.ownerId;
        delete dataValue.key;
        delete dataValue.productId;
        delete dataValue.bundleId;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toFileAdmin = () => {
        const dataValue = this.get() as any;
        delete dataValue.ownerId;
        delete dataValue.productId;
        delete dataValue.bundleId;
        delete dataValue.key;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }


    public toSplashImage = () => {
        const dataValue = this.get() as any;

        delete dataValue.ownerId;
        delete dataValue.status;
        delete dataValue.ownerId;
        delete dataValue.key;
        delete dataValue.productId;
        delete dataValue.bundleId;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Files.init(init, {
    sequelize: DB,
    tableName: 'files',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id', 'type', 'productId', 'bundleId']
    }]
});

export default Files;