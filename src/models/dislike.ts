import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

interface DislikeAttributes {
  id: number;
  user_id: number;
  pokemon_ids: number[];
  created_at?: Date;
  updated_at?: Date;
}

interface DislikeCreationAttributes extends Optional<DislikeAttributes, "id"> {}

class Dislike
  extends Model<DislikeAttributes, DislikeCreationAttributes>
  implements DislikeAttributes
{
  public id!: number;
  public user_id!: number;
  public pokemon_ids!: number[];

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Dislike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    pokemon_ids: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Dislike",
    tableName: "dislikes",
    timestamps: true,
  }
);

export default Dislike;
