"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ResumeData } from "@/lib/types";

export default function ParselyLandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parsedResume, setParsedResume] = useState<ResumeData | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const parsedData = await res.json();
      setParsedResume(parsedData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error parsing resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={loading || !file} className="">
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          {loading ? "Parsing..." : "Upload and Parse"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parsed Resume</DialogTitle>
          </DialogHeader>
          {parsedResume && (
            <>
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Personal Information
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Name</TableCell>
                      <TableCell>{parsedResume.Name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Email</TableCell>
                      <TableCell>{parsedResume.Email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mobile</TableCell>
                      <TableCell>{parsedResume.Mobile}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Date of Birth
                      </TableCell>
                      <TableCell>{parsedResume.DateOfBirth}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Age</TableCell>
                      <TableCell>{parsedResume.Age}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Gender</TableCell>
                      <TableCell>{parsedResume.Gender}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nationality</TableCell>
                      <TableCell>{parsedResume.Nationality}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Residency</TableCell>
                      <TableCell>{parsedResume.Residency}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Notice Period
                      </TableCell>
                      <TableCell>{parsedResume.NoticePeriod}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AI Summary</TableCell>
                      <TableCell>{parsedResume.ProfileSummary}</TableCell>
                    </TableRow>
                    {parsedResume.Nationality && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Nationality
                        </TableCell>
                        <TableCell>{parsedResume.Nationality}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Work Experience */}
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="work-experience">
                  <AccordionTrigger>💼 Work Experience</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedResume.WorkExperience?.map((job, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {job.Company}
                            </TableCell>
                            <TableCell>{job.JobTitle}</TableCell>
                            <TableCell>
                              {job.Summary && job.Summary.length > 0 ? (
                                <ul className="list-disc pl-4">
                                  {job.Summary.map((item, i) => (
                                    <li key={i}>{item.Description}</li>
                                  ))}
                                </ul>
                              ) : (
                                "No summary provided"
                              )}
                            </TableCell>

                            <TableCell>
                              {job.From} - {job.To || "Present"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education">
                  <AccordionTrigger>🎓 Education</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School</TableHead>
                          <TableHead>Qualification</TableHead>
                          <TableHead>Major</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedResume.Education?.map((edu, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {edu.School}
                            </TableCell>
                            <TableCell>{edu.Qualification}</TableCell>
                            <TableCell>{edu.Major}</TableCell>
                            <TableCell>
                              {edu.From} - {edu.To}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
