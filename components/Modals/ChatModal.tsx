"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "@/hooks/useModal";
import { Message } from "ai";
import { useChat } from "ai/react";
import { Bot, List, Trash, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Props = {};

function ChatModal({}: Props) {
  const { isOpen, onOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "openChat";
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    setInput,
  } = useChat();
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";
  const questions = [
    "Most Expensive Product",
    "Cheapest Product",
    "How Many Product in total?",
  ];
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="bottom-0 right-0 z-10 w-full sm:max-w-[500px] p-1 xl:right-36 fixed"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <button onClick={() => onClose()} className="mb-1 ms-auto block">
            <XCircle size={30} />
          </button>
          <div className="flex h-full max-h-[300px] sm:max-h-none sm:h-[600px] flex-col rounded border bg-background shadow-xl">
            <div className="mt-3 h-full overflow-y-auto px-3">
              {messages.map((message) => (
                <ChatMessage message={message} key={message.id} />
              ))}
              {isLoading && lastMessageIsUser && (
                <ChatMessage
                  message={{
                    role: "assistant",
                    content: "Thinking...",
                  }}
                />
              )}
              {error && (
                <ChatMessage
                  message={{
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                  }}
                />
              )}
              {!error && messages.length === 0 && (
                <div className="flex h-full items-center justify-center gap-3">
                  <Bot />
                  Ask the AI a questions about the website.
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="m-3 flex gap-1">
              <Button
                title="Clear chat"
                variant="outline"
                size="icon"
                className="shrink-0"
                type="button"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <List />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Common Question</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {questions.map((question) => (
                      <DropdownMenuItem
                        onClick={() => setInput(question)}
                        className="cursor-pointer"
                        key={question}
                      >
                        {question}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Button>
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatModal;

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  // const { user } = useUser();
  const { data: session } = useSession();
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end"
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {content}
      </p>
      {!isAiMessage && session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
