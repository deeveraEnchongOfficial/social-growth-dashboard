"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { integrations } from "@/lib/mock/data";
import { USER_ROLES, GUARDRAILS, NOTIFICATION_TYPES } from "@/lib/constants";
import { toast } from "sonner";

export default function SettingsPage() {
  const [guardrails, setGuardrails] = useState<Record<string, boolean>>(
    Object.fromEntries(GUARDRAILS.map((g) => [g, true]))
  );
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_TYPES.map((n) => [n, true]))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Brand Guardrails"
        description="The rules that keep every AI output on-brand and safe."
        actions={
          <Button size="sm" onClick={() => toast.success("Settings saved")}>
            <Check className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brand voice rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brand voice rules</CardTitle>
            <p className="text-xs text-muted-foreground">Used by every generator.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tone">
                <Input defaultValue="Educational, calm" />
              </Field>
              <Field label="Personality">
                <Input defaultValue="Founder-led pro authority" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reading level">
                <Input defaultValue="Grade 7–9 (accessible)" />
              </Field>
              <Field label="CTA style">
                <Input defaultValue="Save / share / consult" />
              </Field>
            </div>
            <Field label="Words to use">
              <Textarea
                rows={2}
                defaultValue="customer-focused, data-driven, approachable, strategy, playbook, insight, growth"
              />
            </Field>
            <Field label="Words to avoid">
              <Textarea
                rows={2}
                defaultValue="hype, exaggeration, miracle, guaranteed, permanent"
              />
            </Field>
            <Field label="Approved claims">
              <Textarea
                rows={2}
                defaultValue="Built for growing teams · Designed for modern marketers · Trusted by data-driven brands"
              />
            </Field>
            <Field label="Claims to avoid">
              <Textarea
                rows={2}
                defaultValue="No unsubstantiated claims. No before/after promises. No “proven” without source."
              />
            </Field>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Content guardrails */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Content guardrails
              </CardTitle>
              <p className="text-xs text-muted-foreground">Hard rules. AI cannot override these.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Always on
                </span>
                <Switch checked disabled />
              </div>
              <Separator />
              {GUARDRAILS.map((rule) => (
                <div key={rule} className="flex items-center justify-between">
                  <span className="text-sm">{rule}</span>
                  <Switch
                    checked={guardrails[rule]}
                    onCheckedChange={(checked) =>
                      setGuardrails((prev) => ({ ...prev, [rule]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
              <p className="text-xs text-muted-foreground">Choose what your team gets pinged about.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {NOTIFICATION_TYPES.map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <Switch
                    checked={notifications[type]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [type]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform & API connections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform & API connections</CardTitle>
          <p className="text-xs text-muted-foreground">Connect your accounts. Status is mocked for this preview.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.provider}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={integration.status} />
                <Button variant="outline" size="sm" onClick={() => toast.info(`Manage ${integration.name}`)}>
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* User permissions */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">User permissions</CardTitle>
            <p className="text-xs text-muted-foreground">Roles control what teammates can do.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Invite dialog")}>
            <Plus className="h-4 w-4" /> Invite teammate
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {USER_ROLES.map((entry) => (
            <div key={entry.role} className="flex items-start justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{entry.role}</p>
                <p className="text-xs text-muted-foreground">{entry.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.info(`Editing ${entry.role}`)}>
                Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
