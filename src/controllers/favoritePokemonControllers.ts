import { Request, Response } from "express";
import { db } from "../models/index";

export const addFavoritePokemon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pokemonId } = req.body;

  try {
    const user = res.locals.user;
    if (!user || !pokemonId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const intPokemonId = parseInt(pokemonId, 10);
    if (isNaN(intPokemonId)) {
      res.status(400).json({ error: "Invalid pokemon ID" });
      return;
    }

    const userRecord = await db.User.findOne({
      where: { email: user.email },
      attributes: ["id"],
    });

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userId = userRecord.id;

    let favorite = await db.Favorite.findOne({ where: { userId } });

    if (favorite) {
      const updatedPokemonIds = new Set(favorite.pokemonIds);
      updatedPokemonIds.add(intPokemonId);
      await favorite.update({ pokemonIds: Array.from(updatedPokemonIds) });

      res.status(200).json({
        message: "Pokemon added to favorites",
        favorite,
      });
    } else {
      favorite = await db.Favorite.create({
        userId,
        pokemonIds: [intPokemonId],
      });

      res.status(201).json({
        message: "Favorite list created and Pokemon added",
        favorite,
      });
    }
  } catch (error) {
    console.error("Error adding favorite Pokemon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFavoritePokemon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pokemonId } = req.body;

  try {
    const user = res.locals.user;
    if (!user || !pokemonId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const intPokemonId = parseInt(pokemonId, 10);
    if (isNaN(intPokemonId)) {
      res.status(400).json({ error: "Invalid pokemon ID" });
      return;
    }

    const userRecord = await db.User.findOne({
      where: { email: user.email },
      attributes: ["id"],
    });

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userId = userRecord.id;

    const favorite = await db.Favorite.findOne({ where: { userId } });

    if (!favorite) {
      res.status(404).json({ message: "No favorites found for this user" });
      return;
    }

    const updatedPokemonIds = favorite.pokemonIds.filter(
      (id: number) => id !== intPokemonId
    );

    if (updatedPokemonIds.length === 0) {
      await favorite.destroy();
      res
        .status(200)
        .json({ message: "Favorite list deleted as no Pokémon remained" });
    } else {
      await favorite.update({ pokemonIds: updatedPokemonIds });
      res.status(200).json({
        message: "Pokemon removed from favorites",
        favorite,
      });
    }
  } catch (error) {
    console.error("Error removing favorite Pokemon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
