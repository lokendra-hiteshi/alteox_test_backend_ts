import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

// Define the attributes for the Organization model
interface OrganizationAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
interface OrganizationCreationAttributes
  extends Optional<OrganizationAttributes, "id"> {}

// Extend Sequelize's Model class
class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  public id!: number;
  public name!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the Organization model with sequelize
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
    timestamps: true,
  }
);

export default Organization;
