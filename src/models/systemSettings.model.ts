import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
export interface SystemSettingAttribute extends Model {
    id: number;
    logo: number;
    mainText: string;
    policy: string;
    termOfUse: string;
    termOfService: string;
    locationPolicy: string;
    kakaoUrl: string;
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
    logo: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    mainText: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    policy: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    termOfUse: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    termOfService: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    locationPolicy: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    kakaoUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: STATUS.ACTIVE,
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

class SystemSettings extends Model<InferAttributes<SystemSettingAttribute>, InferCreationAttributes<SystemSettingAttribute>> {
    public id!: number;
    public logo!: number;
    public mainText!: string;
    public policy!: string;
    public termOfUse!: string;
    public termOfService!: string;
    public locationPolicy!: string;
    public kakaoUrl: string;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toDataSystemSetting = () => {
        const dataValue = this.get() as any;
        dataValue.logo = dataValue.logoUrl.url;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.logoUrl;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataTitle = () => {
        const dataValue = this.get() as any;
        dataValue.title = dataValue.mainText;
        dataValue.subTitle = `이번 주 MD 상품과 로컬리커 소믈리에\n추천 주류 목록입니다.`;
        delete dataValue.logo;
        delete dataValue.id;
        delete dataValue.mainText;
        delete dataValue.termOfService;
        delete dataValue.policy;
        delete dataValue.termOfUse;
        delete dataValue.locationPolicy;
        delete dataValue.kakaoUrl;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toDataKakaoUrl = () => {
        const dataValue = this.get() as any;
        delete dataValue.logo;
        delete dataValue.id;
        delete dataValue.mainText;
        delete dataValue.termOfService;
        delete dataValue.policy;
        delete dataValue.termOfUse;
        delete dataValue.locationPolicy;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

SystemSettings.init(init, {
    sequelize: DB,
    tableName: 'system_settings',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

SystemSettings.belongsTo(Files, { targetKey: "id", as: 'logoUrl', foreignKey: 'logo' });


export default SystemSettings;