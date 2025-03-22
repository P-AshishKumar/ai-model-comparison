import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useApiStore } from "@/hooks/useApiStore";

function LoginFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setApiKeys } = useApiStore();

  // Check for registration success message
  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccess("Registration successful! You can now log in.");
    }
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // For testing purposes, accept dummy credentials directly in the client
      if (email === "test@example.com" && password === "password123") {
        // Simulate a delay for the login process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirect to dashboard
        router.push("/dashboard");
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response. Please try again later.");
        }
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Failed to process server response. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      // Store API keys from the response if they exist
      if (data.apiKeys) {
        // Store in global state
        setApiKeys(data.apiKeys);

        // Add try-catch for localStorage
        try {
          localStorage.setItem('apiKeys', JSON.stringify(data.apiKeys));
        } catch (err) {
          console.warn('Failed to store API keys in localStorage:', err);
          // This can happen if storage is full or disabled
        }
      }

      // Check if response includes redirect URL
      if (data.redirect) {
        router.push(data.redirect);
      } else {
        // Default fallback
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-800 dark:text-green-300">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
          </div>
          {error && <div className="text-sm text-red-500 dark:text-red-400">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
