import React from "react";
import prisma from "../lib/db/prisma";
import Image from "next/image";

type Props = {};

async function HomePage({}: Props) {
  const products = await prisma.product.findMany();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="shadow-md p-3 rounded-lg dark:shadow-slate-500 flex flex-col items-center justify-between gap-y-3"
        >
          <div className="h-full flex items-center justify-center">
            <Image
              alt={product.title}
              src={product.imageUrl}
              width={150}
              height={200}
            />
          </div>

          <p>{product.title}</p>
          <h1 className="font-medium">${product.price}</h1>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
