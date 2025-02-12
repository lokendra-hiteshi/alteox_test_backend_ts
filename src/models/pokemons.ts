import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

interface PokemonAttributes {
  id: number;
  name: string;
  imageUrl: string;
  pokemonType: string;
  organizationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PokemonCreationAttributes extends Optional<PokemonAttributes, "id"> {}

class Pokemon
  extends Model<PokemonAttributes, PokemonCreationAttributes>
  implements PokemonAttributes
{
  public id!: number;
  public name!: string;
  public imageUrl!: string;
  public pokemonType!: string;
  public organizationId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pokemonType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Organizations",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Pokemon",
    timestamps: true,
  }
);

export default Pokemon;
