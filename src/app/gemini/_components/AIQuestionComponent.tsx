"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AIQuestionComponent() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await res.json();
      setResponse(data.text || "No response from AI");
    } catch (error) {
      console.log(error);
      setResponse("Error fetching AI response");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-4">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question..."
        className="w-full"
      />
      <Button onClick={handleAskAI} disabled={loading}>
        {loading ? "Asking..." : "Ask AI"}
      </Button>
      {response && (
        <Card>
          <CardContent className="p-4">{response}</CardContent>
        </Card>
      )}
    </div>
  );
}
