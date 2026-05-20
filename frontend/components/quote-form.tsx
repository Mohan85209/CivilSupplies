"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import type { QuoteResponse } from "@/lib/types";

const MAX_MB = 10;
const ACCEPTED = [".pdf", ".xlsx", ".xls"] as const;
const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(20).regex(/^[+0-9 \-]+$/, "Use digits, spaces, dashes only"),
  email: z.string().email(),
  project_details: z.string().max(4000).optional().or(z.literal("")),
  site_location: z.string().max(200).optional().or(z.literal("")),
  timeline: z.string().max(120).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function validateFile(file: File | null): string | null {
  if (!file) return null;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ACCEPTED.includes(ext as (typeof ACCEPTED)[number]) && !ACCEPTED_MIME.has(file.type)) {
    return "BOQ file must be PDF, XLSX, or XLS.";
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return `File exceeds ${MAX_MB}MB limit.`;
  }
  return null;
}

export function QuoteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", project_details: "", site_location: "", timeline: "" },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    const err = validateFile(f);
    setFileError(err);
    setFile(err ? null : f);
  };

  const onSubmit = (values: FormValues) => {
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setSubmitting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    if (values.project_details) formData.append("project_details", values.project_details);
    if (values.site_location) formData.append("site_location", values.site_location);
    if (values.timeline) formData.append("timeline", values.timeline);
    if (file) formData.append("boq_file", file);

    // XHR (not fetch) — we want upload progress events.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/quotes`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setSubmitting(false);
      try {
        const data = JSON.parse(xhr.responseText) as QuoteResponse | { detail: string };
        if (xhr.status >= 200 && xhr.status < 300 && "success" in data) {
          toast.success(data.message);
          reset();
          setFile(null);
          setProgress(0);
        } else {
          const detail = "detail" in data ? data.detail : "Request failed";
          toast.error(detail);
        }
      } catch {
        toast.error("Unexpected server response.");
      }
    };

    xhr.onerror = () => {
      setSubmitting(false);
      toast.error("Network error. Please try again.");
    };

    xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="q-name">Name *</Label>
          <Input id="q-name" {...register("name")} className="mt-1" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="q-phone">Phone *</Label>
          <Input id="q-phone" inputMode="tel" {...register("phone")} className="mt-1" />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="q-email">Email *</Label>
          <Input id="q-email" type="email" {...register("email")} className="mt-1" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="q-site">Site location</Label>
          <Input id="q-site" {...register("site_location")} placeholder="e.g. Kondapur, Hyderabad" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="q-timeline">Timeline</Label>
        <Input id="q-timeline" {...register("timeline")} placeholder="e.g. Start Aug 2026, 6 months" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="q-details">Project details</Label>
        <Textarea id="q-details" rows={5} {...register("project_details")} placeholder="Type of project, scope, key materials needed..." className="mt-1" />
      </div>

      <div>
        <Label htmlFor="q-boq">BOQ file (PDF / XLSX / XLS, max {MAX_MB}MB)</Label>
        <label htmlFor="q-boq" className="mt-1 flex items-center gap-3 rounded-md border border-dashed border-input bg-secondary/30 px-4 py-6 cursor-pointer hover:bg-secondary/50 transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">{file ? file.name : "Click to upload BOQ"}</div>
            <div className="text-xs text-muted-foreground">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Optional — speeds up our response"}</div>
          </div>
          <input id="q-boq" type="file" accept=".pdf,.xlsx,.xls" onChange={onFileChange} className="hidden" />
        </label>
        {fileError && <p className="text-xs text-destructive mt-1">{fileError}</p>}
      </div>

      {submitting && progress > 0 && progress < 100 && (
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <Button type="submit" disabled={submitting} variant="accent" size="lg">
        {submitting ? `Uploading${progress ? ` ${progress}%` : "..."}` : "Submit quote request"}
      </Button>

      <p className="text-xs text-muted-foreground">We respond within 24 hours on business days.</p>
    </form>
  );
}
