import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "./db/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });
  return currentUser;
}
