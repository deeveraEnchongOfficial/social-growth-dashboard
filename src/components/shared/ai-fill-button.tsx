"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AiFillButtonProps {
  formType: "content" | "scripts" | "images" | "repurpose" | "knowledge";
  onFill: (fields: Record<string, string>) => void;
  hint?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * AI-powered form autofill button.
 * Calls /api/autofill with the form type and optional hint,
 * then calls onFill() with the suggested field values.
 */
export function AiFillButton({
  formType,
  onFill,
  hint,
  label = "AI Fill",
  variant = "outline",
  size = "sm",
  className,
}: AiFillButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleFill() {
    setLoading(true);
    try {
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, hint }),
      });
      if (!res.ok) throw new Error("Autofill failed");
      const data = await res.json();
      if (data.fields) {
        onFill(data.fields);
        toast.success("Form populated with AI suggestions");
      }
    } catch {
      toast.error("AI fill failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleFill}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
