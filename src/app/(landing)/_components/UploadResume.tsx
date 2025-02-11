"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";

export default function ParselyLandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data.data || "No response from AI");
    } catch (error) {
      console.error(error);
      setResponse("Error parsing resume");
    }

    setLoading(false);
  };

  return (
    <section className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
      <div className="flex flex-col items-center space-y-4">
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          {loading ? "Parsing..." : "Upload and Parse"}
        </Button>
        {response && (
          <Card className="w-full">
            <CardContent className="p-4 whitespace-pre-wrap">
              {response}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
