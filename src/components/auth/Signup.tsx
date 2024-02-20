import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// form schema with zod
const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const { signup, signinWithGoogle } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function signInWithGoogleProvider() {
    try {
      signinWithGoogle();
    } catch (err) {}
  }

  const [error, setError] = useState<null | string>(null);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signup(values.email, values.password);
      navigate("/app");
    } catch (err: any) {
      if ((err.message = "Firebase: Error (auth/email-already-in-use).")) {
        setError("this email already used");
      } else {
        setError("failed to created account");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 md:mt-20">
        Create an Account
      </h2>{" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-4 flex-col">
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                    className="mb-2"
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
          <Button
            type="submit"
            className="mt-3 w-full dark:bg-slate-950 dark:text-gray-400"
          >
            Sign up
          </Button>
        </form>
      </Form>
      <div className="px-4 mt-3">
        <Button
          className="w-full bg-transparent border-[1px]"
          onClick={signInWithGoogleProvider}
        >
          <img src="/google-icon.svg" alt="google-icon" className="w-4 me-2" />{" "}
          <span className="text-black font-semibold dark:text-gray-400">
            Google
          </span>
        </Button>
      </div>
    </div>
  );
}
