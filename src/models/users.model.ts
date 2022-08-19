import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { DEFAULT_AVATAR, ROLE_USER, STATUS, GENDER } from "../utils/const";
import { DB } from "../libs/mysql";
import Files from "./files.model";
import UserSettings from "./userSettings.model";
import Categories from "./categories.model";
import CategoryProfiles from "./categoriesProfile.model";
import DeviceSessions from "./deviceSession.model";

export interface UserAttribute extends Model {
    id: number;
    avatar: number;
    email: string;
    nickname: string;
    password: string;
    name: string;
    dateOfBirth: Date;
    phoneNumber: string;
    kakaoId: string;
    appleId: string;
    CI_value: string;
    uid: string;
    role: ROLE_USER;
    age: number;
    gender: GENDER;
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
    avatar: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
       // defaultValue: 580 // hardcode
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    nickname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    dateOfBirth: {
        allowNull: true,
        type: Sequelize.DataTypes.DATE(),
    },
    phoneNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    kakaoId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    appleId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    CI_value: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    uid: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: Sequelize.DataTypes.ENUM(
            ROLE_USER.ADMIN,
            ROLE_USER.USER
        ),
        allowNull: false,
        defaultValue: ROLE_USER.USER,
    },
    age: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    gender: {
        type: Sequelize.DataTypes.ENUM(
            GENDER.FEMALE,
            GENDER.MALE
        ),
        allowNull: false,
        defaultValue: GENDER.MALE
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
class Users extends Model<InferAttributes<UserAttribute>, InferCreationAttributes<UserAttribute>> {
    public id!: number;
    public avatar!: number;
    public email!: string;
    public nickname!: string;
    public name!: string;
    public dateOfBirth!: Date;
    public phoneNumber!: string;
    public password!: string;
    public kakaoId: string;
    public appleId: string;
    // tslint:disable-next-line: variable-name
    public CI_value: string;
    public uid: string;
    public role!: ROLE_USER;
    public age!: number;
    public gender!: GENDER;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public toUser = () => {
        const dataValue = this.get() as any;

        dataValue.avatar = (!dataValue.avatarUrl) ? DEFAULT_AVATAR : dataValue.avatarUrl?.url;

        delete dataValue.id;
        delete dataValue.avatarUrl;
        delete dataValue.password;
        delete dataValue.kakaoId;
        delete dataValue.appleId;
        
        delete dataValue.status;
        delete dataValue.gender;
        delete dataValue.age;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toUserData = () => {
        const dataValue = this.get() as any;
        delete dataValue.avatar
        delete dataValue.id;
        delete dataValue.avatarUrl;
        delete dataValue.password;
        delete dataValue.kakaoId;
        delete dataValue.appleId;        
        
        delete dataValue.status;
        delete dataValue.gender;
        delete dataValue.age;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toUserManagement = () => {
        const dataValue = this.get() as any;
        const categories = dataValue.category_profile.map((item: any) => item.category);

        const personal = categories.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            const name = a.name || '';
            if (!!name) {
                r[key].push(name);
            }
            return r;
        }, Object.create(null));

        dataValue.personal = personal;

        delete dataValue.category_profile
        delete dataValue.avatar
        delete dataValue.avatarUrl;
        delete dataValue.password;
        delete dataValue.kakaoId;
        delete dataValue.appleId;
        
        delete dataValue.status;
        delete dataValue.gender;
        delete dataValue.age;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toUserManagementDetail = () => {
        const dataValue = this.get() as any;

        const categories = dataValue.category_profile.map((item: any) => item.category);

        const personal = categories.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            const name = a.name || '';
            if (!!name) {
                r[key].push(name);
            }
            return r;
        }, Object.create(null));

        dataValue.avatar = (!dataValue.avatarUrl) ? DEFAULT_AVATAR : dataValue.avatarUrl?.url;
        dataValue.personal = personal;

        delete dataValue.CI_value;
        delete dataValue.category_profile
        delete dataValue.avatarUrl;
        delete dataValue.password;
        delete dataValue.kakaoId;
        delete dataValue.appleId;
        
        delete dataValue.status;
        delete dataValue.gender;
        delete dataValue.age;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }

    public toUserMyDetail = () => {
        const dataValue = this.get() as any;
        const categories = dataValue.category_profile.map((item: any) => item.category);

        const personal = categories.reduce((r: any, a: any) => {
            const key = (a.type as string).toLowerCase();
            r[key] = r[key] || [];
            if (!!a.id) {
                r[key].push(a.id);
            }
            return r;
        }, Object.create(null));

        dataValue.avatar = (!dataValue.avatarUrl) ? DEFAULT_AVATAR : dataValue.avatarUrl?.url;

        dataValue.totalLikeProduct = dataValue.setting.totalLike;
        dataValue.totalReview = dataValue.setting.totalReview;
        dataValue.notification = dataValue.setting.notification;

        dataValue.personal = personal;

        delete dataValue.setting;
        delete dataValue.CI_value;
        delete dataValue.category_profile
        delete dataValue.id;
        delete dataValue.avatarUrl;
        delete dataValue.password;
        delete dataValue.kakaoId;
        delete dataValue.appleId;
        
        delete dataValue.status;
        delete dataValue.gender;
        delete dataValue.age;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Users.init(init, {
    sequelize: DB,
    tableName: 'users',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id', "email", "nickname", "phoneNumber"]
    }]
});

Users.belongsTo(Files, { targetKey: "id", as: 'avatarUrl', foreignKey: 'avatar' });
Users.hasOne(UserSettings, { sourceKey: "id", foreignKey: 'userId', as: "setting" });
Users.hasMany(CategoryProfiles, { sourceKey: "id", as: 'category_profile', foreignKey: 'userId' });
Users.belongsToMany(Categories, { sourceKey: "id", as: "categories", through: "categories_profile", foreignKey: "userId" });
Users.hasMany(DeviceSessions, { sourceKey: "id", as: 'device_session', foreignKey: 'userId' });

export default Users;