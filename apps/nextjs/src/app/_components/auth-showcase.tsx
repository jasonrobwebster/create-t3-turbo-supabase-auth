import { getUser, signIn, signOut, signUp } from "@acme/auth";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

export async function AuthShowcase() {
  const user = await getUser();

  if (!user) {
    return (
      <form className="flex flex-col space-y-2">
        <Input name="email" type="email" placeholder="email" />
        <Input name="password" type="password" placeholder="password" />
        <Button
          size="lg"
          formAction={async (formData) => {
            "use server";
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            try {
              await signIn({
                email,
                password,
              });
            } catch (error) {
              console.error("Error signing in:", error);
              try {
                await signUp({
                  email,
                  password,
                });
              } catch (error) {
                console.error("Error signing up:", error);
              }
            }
          }}
        >
          Sign in
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {user.id}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
