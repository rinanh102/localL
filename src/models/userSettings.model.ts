import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { NOTIFICATION, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import DeviceSessions from "./deviceSession.model";
export interface UserSettingAttribute extends Model {
    id: number;
    userId: number;
    status: number;
    totalLike: number;
    totalReview: number;
    notification: number;
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
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
    },
    totalLike: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        default: 0
    },
    totalReview: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        default: 0
    },
    notification: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        default: NOTIFICATION.ON
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
class UserSettings extends Model<InferAttributes<UserSettingAttribute>, InferCreationAttributes<UserSettingAttribute>> {
    public id!: number;
    public userId!: number;
    public status!: number;
    public totalLike!: number;
    public totalReview!: number;
    public notification!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public getTokens = () => {
        const dataValue = this.get() as any;
        const tokens = dataValue.tokens.map((item: any) => item.deviceToken);
        dataValue.tokens = tokens;
        delete dataValue.id;
        delete dataValue.userId;
        delete dataValue.totalLike;
        delete dataValue.totalReview;
        delete dataValue.notification;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

UserSettings.init(init, {
    sequelize: DB,
    tableName: 'user_settings',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

UserSettings.hasMany(DeviceSessions, { sourceKey: "userId", as: 'tokens', foreignKey: 'userId' })

export default UserSettings;