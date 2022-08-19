import Sequelize, { InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Tastes from "./tastes.model";
export interface TasteEvaluationAttribute extends Model {
    id: number;
    tasteId: number;
    productId: number;
    score: number;
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
    productId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    tasteId: {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    score: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
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

class TasteEvaluations extends Model<InferAttributes<TasteEvaluationAttribute>, InferCreationAttributes<TasteEvaluationAttribute>> {
    public id!: number;
    public tasteId!: number;
    public productId!: number;
    public score!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public toDataTasteEvaluation = () => {
        const dataValue = this.get() as any;
        delete dataValue.id;
        delete dataValue.status;
        delete dataValue.createdAt;
        delete dataValue.updatedAt;
        return dataValue;
    }
}

TasteEvaluations.init(init, {
    sequelize: DB,
    tableName: 'taste_evaluation',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [{
        fields: ['id']
    }]
});
TasteEvaluations.belongsTo(Tastes, {targetKey: 'id', as: 'taste', foreignKey: 'tasteId' })
export default TasteEvaluations;