"use client";
import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";
import { X } from "lucide-react";
type Props = {};

function AddProductModal({}: Props) {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "addProduct";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState({
    title: "",
    price: 0,
    category: "",
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>();
  const { edgestore } = useEdgeStore();
  const categories = ["Technology", "Beauty", "Fashion", "Other"];
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.category || data.price === 0 || !data.title) {
      toast({
        variant: "destructive",
        title: "Please fill all required fields.",
        duration: 1000,
      });
      return;
    }
    setIsLoading(true);
    const res = await fetch("/api/product", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const message = await res.json();
    if (message.status !== 200) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        duration: 1000,
        title: message.message,
      });
      return;
    }
    setIsLoading(false);
    toast({
      variant: "default",
      duration: 1000,
      title: message.message,
    });
    setData({ category: "", price: 0, title: "", imageUrl: "" });
    setFile(null);
    setProgress(0);
    onClose();
    router.refresh();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Create your own Product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="title" className="sm:text-right">
                Title
              </Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                id="title"
                className="col-span-3"
                name="title"
                placeholder="Enter the Product Title"
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="price" className="sm:text-right">
                Price
              </Label>
              <Input
                value={data.price}
                onChange={(e) =>
                  setData({ ...data, price: parseFloat(e.target.value) })
                }
                name="name"
                id="name"
                type="number"
                placeholder="Enter your name"
                className="col-span-3"
              />
            </div>
            {data.imageUrl ? (
              <div className="flex flex-col gap-y-4 ">
                <Image
                  src={data.imageUrl}
                  alt="Image"
                  width={100}
                  height={200}
                  className="rounded-sm mx-auto"
                />
                <Button
                  className="w-fit mx-auto"
                  disabled={isLoading}
                  variant={"destructive"}
                  onClick={() => {
                    setData({ ...data, imageUrl: "" });
                    setFile(null);
                    setProgress(0);
                  }}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <>
                {file ? (
                  <div className="flex flex-col gap-y-4">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Image"
                      width={100}
                      height={200}
                      className="rounded-sm mx-auto"
                    />
                    {progress > 0 && <Progress value={progress} />}

                    <div className="flex items-center justify-center gap-x-3">
                      <Button
                        disabled={isUploading}
                        variant={"destructive"}
                        onClick={() => setFile(null)}
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={isUploading}
                        type="button"
                        className="w-fit"
                        onClick={async () => {
                          if (file) {
                            setIsUploading(true);
                            const res = await edgestore.publicImages.upload({
                              file,
                              onProgressChange: (progress) => {
                                // you can use this to show a progress bar
                                setProgress(progress);
                              },
                            });
                            // you can run some server action or api here
                            // to add the necessary data to your database
                            setData({ ...data, imageUrl: res.url });
                            toast({
                              title: "Uploaded",
                              duration: 1000,
                              variant: "default",
                            });
                            setIsUploading(false);
                          }
                        }}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
                    <Label htmlFor="image" className="sm:text-right">
                      Image
                    </Label>
                    <Input
                      onChange={(e) => {
                        setFile(e.target.files?.[0]);
                      }}
                      name="image"
                      id="image"
                      type="file"
                      className="col-span-3 cursor-pointer"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="category" className="sm:text-right">
                Category
              </Label>
              <Select
                name="category"
                value={data.category}
                onValueChange={(value) => setData({ ...data, category: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductModal;
