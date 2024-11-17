"use client";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";
import { AuthForm } from "./auth-form";

export function AuthShowcase() {
  const user = api.auth.getUser.useQuery();
  const utils = api.useUtils();

  const signOut = api.auth.signOut.useMutation({
    onSuccess: async () => {
      toast.success("Signed out successfully");
      await utils.auth.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to sign out. " + err.message);
    },
  });

  if (user.isLoading) {
    return <p>Loading...</p>;
  }

  if (!user.data) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {user.data.id}</span>
      </p>

      <form>
        <Button size="lg" formAction={() => signOut.mutate()}>
          Sign out
        </Button>
      </form>
    </div>
  );
}
