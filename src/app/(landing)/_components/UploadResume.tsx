"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ParselyLandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
      setResponse("Error parsing resume");
    }

    setLoading(false);
  };

  return (
    <>
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
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Parsed Resume</DialogTitle>
                <DialogDescription>{response}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
