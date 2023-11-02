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
import { toast } from "../ui/use-toast";
import { register } from "@/Actions/register";
type Props = {};

function RegisterModal({}: Props) {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "register";
  const [isLoading, setIsLoading] = useState(false);
  const registerAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const message = await register(email, name, password);
    setIsLoading(true);
    if (message.includes("Failed")) {
      toast({
        title: message.replace("Failed", ""),
        variant: "destructive",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }
    toast({
      title: message,
      variant: "default",
      duration: 1000,
    });
    setIsLoading(false);
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>Create your own Account.</DialogDescription>
        </DialogHeader>
        <form action={registerAction}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="email" className="sm:text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                name="email"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="name" className="sm:text-right">
                Name
              </Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter your name"
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="password" className="sm:text-right">
                Password
              </Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;
