import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Prompt } from "@shared/schema";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const { data: prompts } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const processMutation = useMutation({
    mutationFn: async ({ promptId, input }: { promptId: number; input: string }) => {
      const res = await apiRequest("POST", `/api/process/${promptId}`, { input });
      return res.json();
    },
    onSuccess: (data) => {
      setResponse(data.response);
    },
  });

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1C1C1E]">
            Welcome, {user?.username}
          </h1>
          <div className="space-x-4">
            {user?.isAdmin && (
              <Button asChild variant="outline">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="destructive"
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Available Prompts</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {prompts?.map((prompt) => (
                <Button
                  key={prompt.id}
                  onClick={() => setSelectedPrompt(prompt)}
                  variant={selectedPrompt?.id === prompt.id ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {prompt.title}
                </Button>
              ))}
            </CardContent>
          </Card>

          {selectedPrompt && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">{selectedPrompt.title}</h2>
                <p className="text-sm text-gray-600">
                  {selectedPrompt.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Your Input</Label>
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your input..."
                    />
                  </div>
                  <Button
                    onClick={() =>
                      processMutation.mutate({
                        promptId: selectedPrompt.id,
                        input: userInput,
                      })
                    }
                    disabled={processMutation.isPending || !userInput}
                    className="w-full bg-[#34C759]"
                  >
                    Process
                  </Button>
                  {response && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <Label>AI Response</Label>
                      <p className="mt-2 text-gray-700">{response}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
