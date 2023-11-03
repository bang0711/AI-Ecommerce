"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModal";
type Props = {};

function AuthMenu({}: Props) {
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-stone-900 py-2 px-4 rounded text-white dark:bg-white dark:text-black">
        Get Started
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Authentication</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onOpen("login")}
        >
          Login
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onOpen("register")}
        >
          Register
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onOpen("openChat")}
        >
          Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AuthMenu;
