import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  organization_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public organization_id?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Users",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
