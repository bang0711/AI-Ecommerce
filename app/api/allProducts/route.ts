import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      title: true,
      price: true,
      category: true,
      imageUrl: true,
    },
  });

  if (!products.length) {
    return NextResponse.json("No Products found.");
  }

  return NextResponse.json(products);
}
