"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, fetcher } from "@/lib/api";
import type { EnquiryResponse } from "@/lib/types";

const PROJECT_TYPES = ["Residential", "Commercial", "Infrastructure", "Industrial"] as const;

const MATERIALS = [
  "OPC Cement",
  "PPC Cement",
  "TMT Steel",
  "Red Bricks",
  "AAC Blocks",
  "M-Sand",
  "Aggregates",
  "RMC",
  "Construction Chemicals",
  "Safety Gear",
];

const schema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20)
    .regex(/^[+0-9 \-]+$/, "Use digits, spaces, dashes only"),
  email: z.string().email("Enter a valid email"),
  city: z.string().max(80).optional().or(z.literal("")),
  project_type: z.enum(PROJECT_TYPES).optional(),
  materials: z.array(z.string()).default([]),
  quantity: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function EnquiryForm({ initialService }: { initialService?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      materials: [],
      quantity: "",
      message: initialService ? `Interested in service: ${initialService}` : "",
    },
  });

  const materials = watch("materials");

  const toggleMaterial = (m: string) => {
    const next = materials.includes(m) ? materials.filter((x) => x !== m) : [...materials, m];
    setValue("materials", next, { shouldDirty: true });
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        city: values.city || null,
        project_type: values.project_type || null,
        materials: values.materials,
        quantity: values.quantity || null,
        message: values.message || null,
      };
      const res = await fetcher<EnquiryResponse>("/api/enquiries", {
        method: "POST",
        body: payload,
      });
      toast.success(res.message);
      reset();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not submit. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} className="mt-1" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" inputMode="tel" {...register("phone")} className="mt-1" />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Project type</Label>
        <Controller
          control={control}
          name="project_type"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label>Materials of interest</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MATERIALS.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={materials.includes(m)}
                onChange={() => toggleMaterial(m)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="quantity">Approximate quantity</Label>
        <Input id="quantity" {...register("quantity")} placeholder="e.g. 200 bags cement, 5 tons steel" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} {...register("message")} className="mt-1" />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={submitting} variant="accent" size="lg">
        {submitting ? "Submitting..." : "Submit enquiry"}
      </Button>
    </form>
  );
}
