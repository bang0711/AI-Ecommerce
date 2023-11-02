import { Session } from "next-auth";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
type Props = {
  session: Session;
};

function Options({ session }: Props) {
  const { onOpen } = useModal();
  const nameWords = session.user?.name?.split(" ");
  // Extract the first letter of each word and join them
  const firstLetters = nameWords?.map((word) => word.charAt(0)).join("");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="border">
          <AvatarImage src={session.user?.image as string} />
          <AvatarFallback>{firstLetters}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Welcome</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer "
          onClick={() => onOpen("addProduct")}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onOpen("openChat")}
        >
          Open Chat
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-center"
          onClick={() => signOut()}
        >
          <Button>Sign Out</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Options;
