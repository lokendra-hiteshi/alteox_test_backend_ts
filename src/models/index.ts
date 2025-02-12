import Organization from "./organizations";
import { sequelize } from "../config/dbConfig";
import User from "./users";
import Pokemon from "./pokemons";
import Favorite from "./favorites";
import Dislike from "./dislike";

Organization.hasMany(User, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});

User.belongsTo(Organization, {
  foreignKey: "organization_id",
});

Organization.hasMany(Pokemon, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});

Pokemon.belongsTo(Organization, {
  foreignKey: "organization_id",
});

User.hasOne(Favorite, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Favorite.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasOne(Dislike, {
  foreignKey: "user_id",
});

Dislike.belongsTo(User, {
  foreignKey: "user_id",
});

export const db = {
  sequelize,
  User,
  Organization,
  Pokemon,
  Favorite,
  Dislike,
};
