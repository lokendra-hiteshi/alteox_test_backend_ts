import axios from "axios";
import { Request, Response } from "express";
import { db } from "../models/index";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

export const generatePokemon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await db.Organization.findAll();
    if (organizations.length === 0) {
      res.status(400).json({ error: "No organizations found" });
      return;
    }

    const orgIds = organizations.map((org: { id: number }) => org.id);

    const fetchPokemon = async (id: number) => {
      try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon-form/${id}/`;
        const response = await axios.get(apiUrl);
        const { name, sprites, types } = response.data;

        return {
          name,
          image_url: sprites.front_default,
          organization_id: orgIds[Math.floor(Math.random() * orgIds.length)],
          pokemon_type: types[0]?.type?.name,
        };
      } catch (error: any) {
        console.warn(`Failed to fetch Pokémon ID ${id}:`, error.message);
        return null;
      }
    };

    const pokemonPromises = Array.from({ length: 200 }, (_, i) =>
      fetchPokemon(i + 1)
    );
    const pokemonData = (await Promise.all(pokemonPromises)).filter(
      Boolean
    ) as Array<{
      name: string;
      image_url: string;
      organization_id: number;
      pokemon_type: string;
    }>;

    if (pokemonData.length > 0) {
      await db.Pokemon.bulkCreate(pokemonData);
    }

    res.status(201).json({
      message: "Pokémon generated successfully!",
      totalPokemons: pokemonData.length,
    });
  } catch (error) {
    console.error("Error generating Pokémon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPokemonByOrganization = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req?.user;

    if (!user?.email) {
      res.status(401).json({ error: "Unauthorized user" });
      return;
    }

    const userInfo = await db.User.findOne({
      where: { email: user.email },
    });

    if (!userInfo) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { page = 1, limit = 10 } = req.query;
    const offset =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

    const favorite = await db.Favorite.findOne({
      where: { user_id: userInfo.id },
      attributes: ["pokemon_ids"],
    });

    const favoritePokemonIds = favorite
      ? new Set(favorite.pokemon_ids)
      : new Set<number>();

    const disliked = await db.Dislike.findOne({
      where: { user_id: userInfo.id },
      attributes: ["pokemon_ids"],
    });

    const disLikedPokemonIds = disliked
      ? new Set(disliked.pokemon_ids)
      : new Set<number>();

    const { count, rows: pokemons } = await db.Pokemon.findAndCountAll({
      where: { organization_id: userInfo.organization_id },
      limit: parseInt(limit as string, 10),
      offset: offset,
    });

    const modifiedPokemons = pokemons.map((pokemon: any) => ({
      ...pokemon.toJSON(),
      isLiked: favoritePokemonIds.has(pokemon.id),
      isDisliked: disLikedPokemonIds.has(pokemon.id),
    }));

    res.status(200).json({
      message: "Pokémon fetched successfully!",
      total: count,
      page: parseInt(page as string, 10),
      totalPages: Math.ceil(count / parseInt(limit as string, 10)),
      pokemons: modifiedPokemons,
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
