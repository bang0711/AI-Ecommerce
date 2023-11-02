"use client";
import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
type Props = {};

function LoginModal({}: Props) {
  const { isOpen, type, onClose } = useModal();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const isModalOpen = isOpen && type === "login";
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast({
        variant: "destructive",
        title: "Please fill all required fields.",
        duration: 1000,
      });
      return;
    }
    setIsLoading(true);
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }
    toast({
      variant: "default",
      title: "Welcome.",
      duration: 1000,
    });
    setIsLoading(false);
    onClose();
    setData({ email: "", password: "" });
    router.refresh();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>Log In with Your own Account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} action="">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="email" className="sm:text-right">
                Email
              </Label>
              <Input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                id="email"
                className="col-span-3"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="password" className="sm:text-right">
                Password
              </Label>
              <Input
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
