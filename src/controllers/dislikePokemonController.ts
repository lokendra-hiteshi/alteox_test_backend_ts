import { Request, Response } from "express";
import { db } from "../models/index";

export const dislikePokemon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pokemonId } = req.body;

  try {
    const user = req?.user;

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
      where: { email: user?.email },
      attributes: ["id"],
    });

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userId = userRecord.id;

    let disliked = await db.Dislike.findOne({ where: { user_id: userId } });

    if (disliked) {
      const updatedPokemonIds = new Set(disliked.pokemon_ids);
      updatedPokemonIds.add(intPokemonId);
      await disliked.update({ pokemon_ids: Array.from(updatedPokemonIds) });

      res.status(200).json({
        message: "Pokemon disliked successfully",
        disliked,
      });
    } else {
      disliked = await db.Dislike.create({
        user_id: userId,
        pokemon_ids: [intPokemonId],
      });

      res.status(201).json({
        message: "Dislike list created and Pokemon added",
        disliked,
      });
    }
  } catch (error) {
    console.error("Error disliking Pokemon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeDislikePokemon = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pokemonId } = req.body;

  try {
    const user = req?.user;
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

    const disliked = await db.Dislike.findOne({ where: { user_id: userId } });

    if (!disliked) {
      res
        .status(404)
        .json({ message: "No disliked Pokémon found for this user" });
      return;
    }

    const updatedPokemonIds = disliked.pokemon_ids.filter(
      (id: number) => id !== intPokemonId
    );

    if (updatedPokemonIds.length === 0) {
      await disliked.destroy();
      res
        .status(200)
        .json({ message: "Dislike list deleted as no Pokémon remained" });
    } else {
      await disliked.update({ pokemon_ids: updatedPokemonIds });
      res.status(200).json({
        message: "Pokemon removed from disliked list",
        disliked,
      });
    }
  } catch (error) {
    console.error("Error removing disliked Pokemon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
