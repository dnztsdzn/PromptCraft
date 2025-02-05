import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    {...loginForm.register("username")}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register("password")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#007AFF]"
                  disabled={loginMutation.isPending}
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={registerForm.handleSubmit((data) =>
                  registerMutation.mutate(data)
                )}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    {...registerForm.register("username")}
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    {...registerForm.register("password")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#007AFF]"
                  disabled={registerMutation.isPending}
                >
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#007AFF] p-12 items-center justify-center">
        <div className="max-w-lg text-white">
          <h1 className="text-4xl font-bold mb-6">AI Interaction Platform</h1>
          <p className="text-lg mb-4">
            Welcome to our controlled AI interaction platform where you can engage
            with AI through carefully crafted prompts.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Secure authentication system</li>
            <li>Admin-defined prompts</li>
            <li>Simple and intuitive interface</li>
            <li>Real-time AI responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
