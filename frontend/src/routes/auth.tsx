import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back!"); navigate({ to: "/" }); }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: String(fd.get("username")), full_name: String(fd.get("full_name")) },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Account created! You're signed in."); navigate({ to: "/" }); }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to PedalPro</CardTitle>
          <CardDescription>Sign in or create an account to book bikes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div><Label htmlFor="si-email">Email</Label><Input id="si-email" name="email" type="email" required /></div>
                <div><Label htmlFor="si-password">Password</Label><Input id="si-password" name="password" type="password" required /></div>
                <Button type="submit" className="w-full" disabled={loading}>Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div><Label htmlFor="su-username">Username</Label><Input id="su-username" name="username" required /></div>
                <div><Label htmlFor="su-name">Full name</Label><Input id="su-name" name="full_name" /></div>
                <div><Label htmlFor="su-email">Email</Label><Input id="su-email" name="email" type="email" required /></div>
                <div><Label htmlFor="su-password">Password</Label><Input id="su-password" name="password" type="password" minLength={6} required /></div>
                <Button type="submit" className="w-full" disabled={loading}>Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}