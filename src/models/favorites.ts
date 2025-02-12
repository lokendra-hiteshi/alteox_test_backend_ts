import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

// Define the attributes for the Favorite model
interface FavoriteAttributes {
  id: number;
  user_id: number;
  pokemon_ids: number[]; // Array of Pokemon IDs
  created_at?: Date;
  updated_at?: Date;
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
  public user_id!: number;
  public pokemon_ids!: number[];

  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Define the Favorite model with sequelize
Favorite.init(
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
    modelName: "Favorite",
    tableName: "favorites",

    timestamps: true,
  }
);

export default Favorite;
