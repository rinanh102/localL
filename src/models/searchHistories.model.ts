import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Keywords from "./keywords.model";
export interface SearchHistoryAttribute extends Model {
    id: number;
    keywordId: number;
    userId: number;
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
    keywordId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
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

class SearchHistories extends Model<InferAttributes<SearchHistoryAttribute>, InferCreationAttributes<SearchHistoryAttribute>> {
    public id!: number;
    public keywordId!: number;
    public userId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataSearchHistory = () => {
        const dataValue = this.get() as any;

        dataValue.content = dataValue.keyword.content;

        delete dataValue.keyword;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

SearchHistories.init(init, {
    sequelize: DB,
    tableName: 'search_histories',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
SearchHistories.belongsTo(Keywords, {targetKey: 'id', as: 'keyword', foreignKey: 'keywordId' })

export default SearchHistories;