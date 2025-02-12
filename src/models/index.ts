import Organization from "./organizations";
import { sequelize } from "../config/dbConfig";
import User from "./users";
import Pokemon from "./pokemons";
import Favorite from "./favorites";
import Dislike from "./dislike";

Organization.hasMany(User, {
  foreignKey: "organizationId",
  onDelete: "CASCADE",
});

User.belongsTo(Organization, {
  foreignKey: "organizationId",
});

Organization.hasMany(Pokemon, {
  foreignKey: "organizationId",
  onDelete: "CASCADE",
});

Pokemon.belongsTo(Organization, {
  foreignKey: "organizationId",
});

User.hasOne(Favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Favorite.belongsTo(User, {
  foreignKey: "userId",
});

User.hasOne(Dislike, {
  foreignKey: "userId",
});

Dislike.belongsTo(User, {
  foreignKey: "userId",
});

export const db = {
  sequelize,
  User,
  Organization,
  Pokemon,
  Favorite,
  Dislike,
};
