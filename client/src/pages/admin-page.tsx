import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Prompt } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPromptSchema, InsertPrompt } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const createForm = useForm<InsertPrompt>({
    resolver: zodResolver(insertPromptSchema),
  });

  const editForm = useForm<InsertPrompt>({
    resolver: zodResolver(insertPromptSchema),
  });

  const { data: prompts } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPrompt) => {
      const res = await apiRequest("POST", "/api/prompts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      createForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertPrompt }) => {
      const res = await apiRequest("PATCH", `/api/prompts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setEditingPrompt(null);
      editForm.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/prompts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });

  const startEditing = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    editForm.reset({
      title: prompt.title,
      description: prompt.description,
      template: prompt.template,
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1E]">Admin Panel</h1>
            <p className="text-gray-600">Manage AI prompts and templates</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))}>
              <CardHeader>
                <h2 className="text-xl font-semibold">Create New Prompt</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...createForm.register("title")} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...createForm.register("description")}
                  />
                </div>
                <div>
                  <Label htmlFor="template">
                    Template (use {"{{"}<span>input</span>{"}}"}  for user input and {"{{"}<span>search</span>{"}}"}  for internet search results)
                  </Label>
                  <Textarea
                    id="template"
                    {...createForm.register("template")}
                    placeholder="Example: Here's what I found about {{input}}:\n\n{{search}}\n\nBased on these results, I can tell you that..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#007AFF]"
                  disabled={createMutation.isPending}
                >
                  Create Prompt
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Existing Prompts</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {prompts?.map((prompt) => (
                  <Card key={prompt.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{prompt.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(prompt)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(prompt.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{prompt.description}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Template:</span>{" "}
                        {prompt.template}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {editingPrompt && (
              <Card>
                <form
                  onSubmit={editForm.handleSubmit((data) =>
                    updateMutation.mutate({ id: editingPrompt.id, data })
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Edit Prompt</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditingPrompt(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Title</Label>
                      <Input id="edit-title" {...editForm.register("title")} />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        {...editForm.register("description")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-template">Template</Label>
                      <Textarea
                        id="edit-template"
                        {...editForm.register("template")}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-[#007AFF]"
                      disabled={updateMutation.isPending}
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}