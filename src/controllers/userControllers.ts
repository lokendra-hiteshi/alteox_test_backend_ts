import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { generateToken } from "../helpers/jwt";
import { db } from "../models";

export const generateUsersForOrganizations = async (
  req: Request,
  res: Response
) => {
  try {
    const organizations = await db.Organization.findAll();
    const totalUsers: Array<{
      email: string;
      password: string;
      organizationId: number;
    }> = [];

    for (const organization of organizations) {
      for (let i = 0; i < 10; i++) {
        const userEmail = faker.internet.email();
        const userPassword = faker.internet.password();

        totalUsers.push({
          email: userEmail,
          password: userPassword,
          organizationId: organization.id,
        });
      }
    }

    await db.User.bulkCreate(totalUsers);

    res.status(201).json({
      message: "Random users created successfully!",
      userCreated: totalUsers.length,
    });
  } catch (error) {
    console.error("Error generating users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = res.locals.user?.email;

    if (!email) {
      res.status(400).json({ error: "User email is missing" });
      return;
    }

    const user = await db.User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
      include: {
        model: db.Organization,
        attributes: ["id", "name"],
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Invalid email" });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = generateToken(email);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, organizationId } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const orgId = parseInt(organizationId, 10);
    if (isNaN(orgId)) {
      res.status(400).json({ error: "Invalid organization ID" });
      return;
    }

    await db.User.create({
      email,
      password,
      organizationId: orgId,
    });

    res.status(201).json({
      message: "User registered successfully, please login.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
