"use client";

import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

export function AuthForm() {
  const form = useForm({
    schema: z.object({
      email: z.string().email(),
      password: z.string().min(6, "Password must be at least 6 characters"),
    }),
  });

  const utils = api.useUtils();

  const signIn = api.auth.signIn.useMutation({
    onSuccess: async () => {
      toast.success("Signed in successfully");
      await utils.auth.invalidate();
    },
    onError: (err, input) => {
      if (err.data?.code === "FORBIDDEN") {
        signUp.mutate({
          email: input.email,
          password: input.password,
        });
      } else {
        toast.error("Failed to sign in. " + err.message);
      }
    },
  });

  const signUp = api.auth.signUp.useMutation({
    onSuccess: async () => {
      toast.success(
        "Signed up successfully. Check your email for a confirmation link.",
      );
      await utils.auth.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to sign up. " + err.message);
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2"
        onSubmit={form.handleSubmit((data) => {
          signIn.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
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
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
}
