import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { KeywordType, STATUS } from "../utils/const";
import { DB } from "../libs/mysql";

export interface KeywordAttribute extends Model {
    id: number;
    content: string;
    type: KeywordType;
    totalSearch: number;
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
    type: {
        type: Sequelize.DataTypes.ENUM(
            KeywordType.ADMIN,
            KeywordType.SEARCH
        ),
        allowNull: false,
        defaultValue: KeywordType.ADMIN
    },
    totalSearch: {
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

class Keywords extends Model<InferAttributes<KeywordAttribute>, InferCreationAttributes<KeywordAttribute>> {
    public id!: number;
    public content!: string;
    public type!: KeywordType;
    public totalSearch!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataKeyword = () => {
        const dataValue = this.get() as any;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

Keywords.init(init, {
    sequelize: DB,
    tableName: 'keywords',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});

export default Keywords;