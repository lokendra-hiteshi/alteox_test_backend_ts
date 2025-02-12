import { Router } from "express";
import {
  generateRandomOrganizations,
  getAllOrganizations,
} from "../controllers/organizationControllers";

import {
  generatePokemon,
  getAllPokemonByOrganization,
} from "../controllers/pokemonControllers";
import { authenticate } from "../middlewares/authMiddleware";
import {
  addFavoritePokemon,
  removeFavoritePokemon,
} from "../controllers/favoritePokemonControllers";
import {
  dislikePokemon,
  removeDislikePokemon,
} from "../controllers/dislikePokemonController";
import {
  generateUsersForOrganizations,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/userControllers";

const router = Router();

// Auth routes
router.post("/login", loginUser);
router.post("/register-user", registerUser);

// Organization routes
router.post(
  "/organization/generate-organizations",
  generateRandomOrganizations
);
router.get("/organizations", getAllOrganizations);

// Pokemon routes
router.post("/pokemon/generate", generatePokemon);
router.get("/pokemons", authenticate, getAllPokemonByOrganization);

// User routes
router.post("/users/generate-users", generateUsersForOrganizations);
router.get("/me", authenticate, getCurrentUser);

// Favorite Pokemon routes
router.post("/add-favorite-pokemon", authenticate, addFavoritePokemon);
router.post("/remove-favorite-pokemon", authenticate, removeFavoritePokemon);

// Dislike Pokemon routes
router.post("/dislike-pokemon", authenticate, dislikePokemon);
router.post("/remove-dislike-pokemon", authenticate, removeDislikePokemon);

export default router;
