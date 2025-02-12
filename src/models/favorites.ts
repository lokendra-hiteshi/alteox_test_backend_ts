import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

// Define the attributes for the Favorite model
interface FavoriteAttributes {
  id: number;
  userId: number;
  pokemonIds: number[]; // Array of Pokemon IDs
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
interface FavoriteCreationAttributes
  extends Optional<FavoriteAttributes, "id"> {}

// Extend Sequelize's Model class
class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  public id!: number;
  public userId!: number;
  public pokemonIds!: number[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the Favorite model with sequelize
Favorite.init(
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
    modelName: "Favorite",
    timestamps: true,
  }
);

export default Favorite;
