import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import openai, { getEmbedding } from "@/lib/openai";
import { NextResponse } from "next/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const currentUser = await getCurrentUser();
  // if (!currentUser) {
  //   return NextResponse.json({
  //     messages: "You have to be logged in",
  //     status: 400,
  //   });
  // }
  const products = await prisma.product.findMany();
  const messages: ChatCompletionMessage[] = body.messages;
  console.log(messages);
  // const userId = currentUser.id;
  const messagesTruncated = messages.slice(-6);
  const embedding = await getEmbedding(
    messagesTruncated.map((message) => message.content).join("\n")
  );
  const vectorQueryResponse = await notesIndex.query({
    vector: embedding,
    topK: products.length,
    // filter: { userId },
  });
  console.log(products.length);
  const relevantProducts = await prisma.product.findMany({
    where: {
      id: {
        in: vectorQueryResponse.matches.map((match) => match.id),
      },
    },
  });
  const systemMessage: ChatCompletionMessage = {
    role: "system",
    content:
      "You are an e-commerce website manager. You answer the user's question based on the existing data in the system. Remember only give them title, price, category, and only show data in the database, if there is no data like that, say no, do not bluff about it. " +
      "This is my data within the system,this data is about the products." +
      relevantProducts.map(
        (product) =>
          `Title: ${product.title}\nPrice: ${product.price}$\n Category:${product.category} \nCreated Date: ${product.createdAt} \nUpdated Date: ${product.updatedAt}`
      ),
  };

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [systemMessage, ...messagesTruncated],
  });
  console.log(response);
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
