import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { useRef, useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function Signin() {
  const [alreadySent, setAlreadySent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { signin, resetPassword } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleForgetPassword() {
    try {
      if (inputRef.current) {
        await resetPassword(inputRef.current?.value);
      }
    } catch (error) {
    } finally {
      setAlreadySent(true);
    }
  }

  const [error, setError] = useState<null | false>(null);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setAlreadySent(false);
      await signin(values.email, values.password);
      navigate("/app");
    } catch (err) {
      if ((err.message = "Firebase: Error (auth/invalid-credential).")) {
        setError("incorrect email or password");
      } else {
        setError("failed to login");
      }
    }
  }
  return (
    <Popover>
      <PopoverTrigger className="right-2 bg-slate-800 text-white py-2 px-4 text-sm rounded-sm md:mt-3">
        Sign in
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} className="mb-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      className="mb-2"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-sm text-red-500 py-1 pb-2 capitalize">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>
        <div className="mt-2">
          <Dialog>
            <DialogTrigger className="w-full text-sm border-[1px] py-2 bg-transparent text-black">
              Forget Password
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="mb-3">Reset Password</DialogTitle>
                <DialogDescription>
                  <Input ref={inputRef} placeholder="Email" className="mb-1" />
                  <Button
                    onClick={handleForgetPassword}
                    className="w-full mt-2"
                    disabled={alreadySent}
                  >
                    {alreadySent ? "Sended" : "Send"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
