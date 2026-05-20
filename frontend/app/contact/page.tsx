"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/api";
import type { EnquiryResponse, ProjectType } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  email: z.string().email("Enter a valid email address"),
  city: z.string().max(80).optional(),
  project_type: z.enum(["Residential", "Commercial", "Infrastructure", "Industrial"]).optional(),
  message: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

const PROJECT_TYPES: ProjectType[] = ["Residential", "Commercial", "Infrastructure", "Industrial"];

const CONTACT_INFO = [
  {
    icon: User,
    label: "Contact Person",
    value: "Sudheer Bellam",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Plot 42, Industrial Estate, Hyderabad, Telangana – 500 072",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 95050 56386",
  },
  {
    icon: Mail,
    label: "Email",
    value: "bellamsudheer19@gmail.com",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat, 9 AM – 6 PM",
  },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetcher<EnquiryResponse>("/api/enquiries", {
        method: "POST",
        body: {
          ...data,
          materials: [],
        },
      });
      toast.success(res.message || "Message sent! We'll be in touch within 24 hours.");
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Page header */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container">
          <h1 className="text-4xl font-display font-bold">Contact Us</h1>
          <p className="mt-3 text-white/80 max-w-xl">
            Have a project inquiry, bulk order, or just want to talk specs? Fill in the form and our
            team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info sidebar */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-xl font-display font-semibold mb-5">Get in touch</h2>
              <ul className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border bg-secondary/40 h-52 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Map embed goes here</p>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-display font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Full name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Suresh Reddy"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Email + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Hyderabad"
                    {...register("city")}
                  />
                </div>
              </div>

              {/* Project type */}
              <div className="space-y-1.5">
                <Label htmlFor="project_type">Project type</Label>
                <Select onValueChange={(val) => setValue("project_type", val as ProjectType)}>
                  <SelectTrigger id="project_type">
                    <SelectValue placeholder="Select project type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((pt) => (
                      <SelectItem key={pt} value={pt}>
                        {pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project, materials needed, timeline…"
                  rows={5}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" disabled={submitting} className="gap-2 w-full sm:w-auto">
                <Send className="h-4 w-4" />
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
