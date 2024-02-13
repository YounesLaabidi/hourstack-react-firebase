import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type EditProfileProps } from "@/types";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import CloseIcon from "../ui/CloseIcon";

const formSchema = z.object({
  newEmail: z
    .string()
    .nullable()
    .refine(
      (val) =>
        val === "" ||
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          val as string
        ),
      {
        message: "Invalid Email",
      }
    ),
  newPassword: z
    .string()
    .nullable()
    .refine((val) => val === "" || /^(.{8,20})$/.test(val as string), {
      message: "password length requirements (8-20 characters)",
    }),
});

export default function EditProfile({ isOpen, setIsOpen }: EditProfileProps) {
  const { theme } = useTheme();
  const { updateUserEmail, updateUserPassword } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: "",
      newPassword: "",
    },
  });
  async function onSubmit({
    newEmail,
    newPassword,
  }: z.infer<typeof formSchema>) {
    try {
      if (newEmail && newEmail !== "") {
        updateUserEmail(newEmail);
      }

      if (newPassword && newPassword !== "") {
        await updateUserPassword(newPassword);
      }
      setIsOpen(false);
    } catch (error) {}
  }

  return (
    isOpen && (
      <div
        className={`absolute top-[20vh] left-1/2 translate-x-[-50%] py-4 px-2 z-20 w-[360px] rounded-md md:w-[450px] border-[1px] shadow-lg  dark:bg-slate-900 bg-white`}
      >
        <h2 className="text-center mb-4 text-xl font-semibold">Edit Profile</h2>
        <p className="mx-2 mb-3 text-sm">
          Stay secure: Refresh email and password in settings
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className=" absolute top-2 right-2"
        >
          {/* <img src="close-icon.svg" alt="" className="w-6 h-6" /> */}
          <CloseIcon theme={theme} />
        </button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-2 flex-col"
          >
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="">
                      <Input
                        placeholder="New Email Address"
                        {...field}
                        value={field.value || ""}
                        className="mb-2"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      value={field.value || ""}
                      className="mb-2"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-3 w-full dark:bg-slate-950 dark:text-white"
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    )
  );
}
