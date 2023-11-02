"use server";

import prisma from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function register(email: string, name: string, password: string) {
  console.log(email, name, password);
  if (!email || !name || !password) {
    return JSON.parse(JSON.stringify("Please fill all required fields.Failed"));
  }

  const isUserExisting = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExisting) {
    return JSON.parse(JSON.stringify("User already exist.Failed"));
  }
  const hashedPassword = await bcrypt.hash(password, 15);
  // Create the user using the plain object data
  await prisma.user.create({
    data: {
      hashedPassword,
      email,
      name,
      collectionId: uuidV4(),
      image:
        "https://imgs.search.brave.com/PzngAPChR2G1EghyNpeb6l57-C-wwF0B_VXbrqZORFw/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzE5LzI2LzQ2/LzM2MF9GXzYxOTI2/NDY4MF94MlBCZEdM/RjU0c0ZlN2tUQnRB/dlpuUHlYZ3ZhUncw/WS5qcGc",
    },
  });

  return JSON.parse(JSON.stringify("Account created"));
}
