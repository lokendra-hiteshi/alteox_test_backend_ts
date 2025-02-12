import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

interface OrganizationAttributes {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

interface OrganizationCreationAttributes
  extends Optional<OrganizationAttributes, "id"> {}

class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  public id!: number;
  public name!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Organization.init(
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
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "organizations",
    timestamps: true,
  }
);

export default Organization;
