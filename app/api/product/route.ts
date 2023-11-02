import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getEmbedding } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, price, category, imageUrl } = body;
  if (!title || !price || !category || !imageUrl) {
    return NextResponse.json({
      message: "Please fill all required fields.",
      status: 400,
    });
  }
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({
      message: "You must log in to create a product.",
      status: 400,
    });
  }
  const userId = currentUser.id;
  const embedding = await getEmbeddingForNote(title, price, category);
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        category,
        price,
        title,
        userId: currentUser.id,
        imageUrl,
      },
    });

    await notesIndex.upsert([
      {
        id: product.id,
        values: embedding,
        metadata: { userId },
      },
    ]);

    return product;
  });
  return NextResponse.json({
    message: `You have added ${title} to your shop`,
    status: 200,
  });
}

async function getEmbeddingForNote(
  title: string,
  price: number,
  category: string
) {
  return getEmbedding(title + "\n\n" + price + "\n\n" + category ?? "");
}
