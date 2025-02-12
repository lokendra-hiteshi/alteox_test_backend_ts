import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

// Define the attributes for the Dislike model
interface DislikeAttributes {
  id: number;
  userId: number;
  pokemonIds: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
interface DislikeCreationAttributes extends Optional<DislikeAttributes, "id"> {}

// Extend Sequelize's Model class
class Dislike
  extends Model<DislikeAttributes, DislikeCreationAttributes>
  implements DislikeAttributes
{
  public id!: number;
  public userId!: number;
  public pokemonIds!: number[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the Dislike model with sequelize
Dislike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    pokemonIds: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Dislike",
    timestamps: true,
  }
);

export default Dislike;
