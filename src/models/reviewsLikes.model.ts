import Sequelize, {
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { STATUS } from "../utils/const";
import { DB } from "../libs/mysql";
import Users from "./users.model";
export interface ReviewLikeAttribute extends Model {
    id: number;
    reviewId: number;
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
        autoIncrement: true,
    },
    reviewId: {
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
};

class ReviewLikes extends Model<
    InferAttributes<ReviewLikeAttribute>,
    InferCreationAttributes<ReviewLikeAttribute>
> {
    public id!: number;
    public reviewId!: number;
    public userId!: number;
    public status!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ReviewLikes.init(init, {
    sequelize: DB,
    tableName: "reviews_likes",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    indexes: [
        {
            fields: ["id"],
        },
    ],
});

ReviewLikes.belongsTo(Users, { targetKey: "id", as: 'user', foreignKey: 'userId' });

export default ReviewLikes;
