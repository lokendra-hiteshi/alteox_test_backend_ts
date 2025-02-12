import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { db } from "../models/index";

export const generateRandomOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations: Array<{ name: string; contactEmail: string }> = [];

    for (let i = 0; i < 10; i++) {
      organizations.push({
        name: faker.company.name(),
        contactEmail: faker.internet.email(),
      });
    }

    await db.Organization.bulkCreate(organizations);
    res.status(201).json({
      message: "10 random organizations created successfully!",
      organizationsCreated: organizations.length,
    });
  } catch (error) {
    console.error("Error generating organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await db.Organization.findAll();

    res.status(200).json({
      message: "Organizations fetched successfully!",
      organizations,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
