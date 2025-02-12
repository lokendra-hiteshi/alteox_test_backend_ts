import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

interface PokemonAttributes {
  id: number;
  name: string;
  image_url: string;
  pokemon_type: string;
  organization_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface PokemonCreationAttributes extends Optional<PokemonAttributes, "id"> {}

class Pokemon
  extends Model<PokemonAttributes, PokemonCreationAttributes>
  implements PokemonAttributes
{
  public id!: number;
  public name!: string;
  public image_url!: string;
  public pokemon_type!: string;
  public organization_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Pokemon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pokemon_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "organizations",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Pokemon",
    tableName: "pokemons",
    timestamps: true,
  }
);

export default Pokemon;
