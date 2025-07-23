"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();
    form.setValue("email", data.email);
    form.setValue("password", data.password);
    form.setFocus("email");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      form.setError("email", { message: "Invalid email or password" });
      form.setError("password", { message: "Invalid email or password" });
    } else {
      window.location.href = "/";
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormDescription>Your login email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormDescription>Your account password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </Form>
  );
}
