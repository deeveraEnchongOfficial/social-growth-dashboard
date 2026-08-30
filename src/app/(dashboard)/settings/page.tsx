"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShieldCheck, Plus, Loader2, Eye, EyeOff, Key, Save,
  Brain, Bell, Plug, Users, Sparkles, AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { USER_ROLES, GUARDRAILS, NOTIFICATION_TYPES } from "@/lib/constants";
import type { AppSettings } from "@/lib/config";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setSettings(data);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function update(path: string, value: unknown) {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as unknown as Record<string, unknown>;
      const parts = path.split(".");
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]] as Record<string, unknown>;
      }
      obj[parts[parts.length - 1]] = value;
      return next as unknown as AppSettings;
    });
  }

  function toggleKey(id: string) {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="All configuration is editable here and saved to your database."
        actions={
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="brand">
        <TabsList className="flex-wrap">
          <TabsTrigger value="brand" className="text-xs"><Brain className="h-3.5 w-3.5" /> Brand Voice</TabsTrigger>
          <TabsTrigger value="guardrails" className="text-xs"><ShieldCheck className="h-3.5 w-3.5" /> Guardrails</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs"><Sparkles className="h-3.5 w-3.5" /> AI Providers</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs"><Plug className="h-3.5 w-3.5" /> Integrations</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="workspace" className="text-xs"><Key className="h-3.5 w-3.5" /> Workspace</TabsTrigger>
          <TabsTrigger value="team" className="text-xs"><Users className="h-3.5 w-3.5" /> Team</TabsTrigger>
        </TabsList>

        {/* ─── Brand Voice ─── */}
        <TabsContent value="brand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Brain className="h-4 w-4 text-primary" /> Brand voice rules</CardTitle>
              <p className="text-xs text-muted-foreground">Used by every AI generator. Changes apply to all future outputs.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tone">
                  <Input value={settings.brandVoice.tone} onChange={(e) => update("brandVoice.tone", e.target.value)} />
                </Field>
                <Field label="Personality">
                  <Input value={settings.brandVoice.personality} onChange={(e) => update("brandVoice.personality", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Reading level">
                  <Input value={settings.brandVoice.readingLevel} onChange={(e) => update("brandVoice.readingLevel", e.target.value)} />
                </Field>
                <Field label="CTA style">
                  <Input value={settings.brandVoice.ctaStyle} onChange={(e) => update("brandVoice.ctaStyle", e.target.value)} />
                </Field>
              </div>
              <Field label="Words to use" description="Comma-separated list of approved vocabulary.">
                <Textarea rows={2} value={settings.brandVoice.wordsToUse} onChange={(e) => update("brandVoice.wordsToUse", e.target.value)} />
              </Field>
              <Field label="Words to avoid" description="Comma-separated list of banned vocabulary.">
                <Textarea rows={2} value={settings.brandVoice.wordsToAvoid} onChange={(e) => update("brandVoice.wordsToAvoid", e.target.value)} />
              </Field>
              <Field label="Approved claims" description="·-separated list of pre-approved marketing claims.">
                <Textarea rows={2} value={settings.brandVoice.approvedClaims} onChange={(e) => update("brandVoice.approvedClaims", e.target.value)} />
              </Field>
              <Field label="Claims to avoid" description="Hard rules the AI must never violate.">
                <Textarea rows={2} value={settings.brandVoice.claimsToAvoid} onChange={(e) => update("brandVoice.claimsToAvoid", e.target.value)} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Guardrails ─── */}
        <TabsContent value="guardrails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" /> Content guardrails</CardTitle>
              <p className="text-xs text-muted-foreground">Hard rules. AI cannot override these when enabled.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Always on (system-level)</span>
                <Switch checked disabled />
              </div>
              <Separator />
              {GUARDRAILS.map((rule) => (
                <div key={rule} className="flex items-center justify-between">
                  <span className="text-sm">{rule}</span>
                  <Switch
                    checked={settings.guardrails[rule] ?? true}
                    onCheckedChange={(checked) => update(`guardrails.${rule}`, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── AI Providers ─── */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> AI provider configuration</CardTitle>
              <p className="text-xs text-muted-foreground">Choose your LLM and image generation provider. API keys are stored encrypted in your database.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Active LLM provider">
                <Select value={settings.aiProviders.activeProvider} onValueChange={(v) => update("aiProviders.activeProvider", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock (no API key needed)</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Separator />

              <ApiKeyField
                label="OpenAI API Key"
                value={settings.aiProviders.openai.apiKey}
                showKey={showKeys["openai"]}
                onToggle={() => toggleKey("openai")}
                onChange={(v) => update("aiProviders.openai.apiKey", v)}
              />
              <Field label="OpenAI Model">
                <Input value={settings.aiProviders.openai.model} onChange={(e) => update("aiProviders.openai.model", e.target.value)} placeholder="gpt-4o" />
              </Field>

              <Separator />

              <ApiKeyField
                label="Anthropic API Key"
                value={settings.aiProviders.anthropic.apiKey}
                showKey={showKeys["anthropic"]}
                onToggle={() => toggleKey("anthropic")}
                onChange={(v) => update("aiProviders.anthropic.apiKey", v)}
              />
              <Field label="Anthropic Model">
                <Input value={settings.aiProviders.anthropic.model} onChange={(e) => update("aiProviders.anthropic.model", e.target.value)} placeholder="claude-sonnet-4-20250514" />
              </Field>

              <Separator />

              <ApiKeyField
                label="Google Gemini API Key"
                value={settings.aiProviders.gemini.apiKey}
                showKey={showKeys["gemini"]}
                onToggle={() => toggleKey("gemini")}
                onChange={(v) => update("aiProviders.gemini.apiKey", v)}
              />
              <Field label="Gemini Model">
                <Input value={settings.aiProviders.gemini.model} onChange={(e) => update("aiProviders.gemini.model", e.target.value)} placeholder="gemini-2.0-flash" />
              </Field>

              <Separator />

              <ApiKeyField
                label="OpenRouter API Key"
                value={settings.aiProviders.openrouter.apiKey}
                showKey={showKeys["openrouter"]}
                onToggle={() => toggleKey("openrouter")}
                onChange={(v) => update("aiProviders.openrouter.apiKey", v)}
              />
              <Field label="OpenRouter Model">
                <Input value={settings.aiProviders.openrouter.model} onChange={(e) => update("aiProviders.openrouter.model", e.target.value)} placeholder="anthropic/claude-3.5-sonnet" />
              </Field>

              <Separator />

              <Field label="Image generation provider">
                <Select value={settings.aiProviders.imageProvider} onValueChange={(v) => update("aiProviders.imageProvider", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pollinations">Pollinations.ai (Free, no API key)</SelectItem>
                    <SelectItem value="mock">Mock (descriptions only)</SelectItem>
                    <SelectItem value="openai">OpenAI Image (DALL-E)</SelectItem>
                    <SelectItem value="stability">Stability AI</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <ApiKeyField
                label="Image API Key"
                value={settings.aiProviders.imageApiKey}
                showKey={showKeys["image"]}
                onToggle={() => toggleKey("image")}
                onChange={(v) => update("aiProviders.imageApiKey", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Integrations ─── */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Plug className="h-4 w-4 text-primary" /> Platform & API connections</CardTitle>
              <p className="text-xs text-muted-foreground">Connect your external accounts. API keys are stored in your database.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <IntegrationField
                name="Tikhub API" description="Creator & prospect data"
                apiKey={settings.integrations.tikhub.apiKey}
                status={settings.integrations.tikhub.status}
                showKey={showKeys["tikhub"]}
                onToggleKey={() => toggleKey("tikhub")}
                onChangeKey={(v) => update("integrations.tikhub.apiKey", v)}
                onStatusChange={(v) => update("integrations.tikhub.status", v)}
              />
              <Separator />
              <IntegrationField
                name="Apify" description="Instagram DM automation"
                apiKey={settings.integrations.apify.apiKey}
                status={settings.integrations.apify.status}
                showKey={showKeys["apify"]}
                onToggleKey={() => toggleKey("apify")}
                onChangeKey={(v) => update("integrations.apify.apiKey", v)}
                onStatusChange={(v) => update("integrations.apify.status", v)}
              />
              <Separator />
              <IntegrationField
                name="Gmail / Email" description="Outreach email sending"
                apiKey={settings.integrations.gmail.apiKey}
                status={settings.integrations.gmail.status}
                showKey={showKeys["gmail"]}
                onToggleKey={() => toggleKey("gmail")}
                onChangeKey={(v) => update("integrations.gmail.apiKey", v)}
                onStatusChange={(v) => update("integrations.gmail.status", v)}
              />
              <Separator />
              <IntegrationField
                name="TikTok" description="Social profile & performance data"
                apiKey={settings.integrations.tiktok.apiKey}
                status={settings.integrations.tiktok.status}
                showKey={showKeys["tiktok"]}
                onToggleKey={() => toggleKey("tiktok")}
                onChangeKey={(v) => update("integrations.tiktok.apiKey", v)}
                onStatusChange={(v) => update("integrations.tiktok.status", v)}
              />
              <Separator />
              <IntegrationField
                name="Instagram" description="Social profile & performance data"
                apiKey={settings.integrations.instagram.apiKey}
                status={settings.integrations.instagram.status}
                showKey={showKeys["instagram"]}
                onToggleKey={() => toggleKey("instagram")}
                onChangeKey={(v) => update("integrations.instagram.apiKey", v)}
                onStatusChange={(v) => update("integrations.instagram.status", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Notifications ─── */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" /> Notifications</CardTitle>
              <p className="text-xs text-muted-foreground">Choose what your team gets pinged about.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {NOTIFICATION_TYPES.map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <Switch
                    checked={settings.notifications[type] ?? true}
                    onCheckedChange={(checked) => update(`notifications.${type}`, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Workspace ─── */}
        <TabsContent value="workspace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Key className="h-4 w-4 text-primary" /> Workspace config</CardTitle>
              <p className="text-xs text-muted-foreground">Brand name and product name shown across the dashboard.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Brand name" description="Shown in the sidebar logo and login page.">
                <Input value={settings.workspace.name} onChange={(e) => update("workspace.name", e.target.value)} />
              </Field>
              <Field label="Product name" description="Shown as the subtitle under the brand name.">
                <Input value={settings.workspace.productName} onChange={(e) => update("workspace.productName", e.target.value)} />
              </Field>
              <div className="flex items-start gap-2 rounded-md bg-warning/10 p-3 text-xs text-warning">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Changing the brand name requires a page refresh to update the sidebar and login page.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Team ─── */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4 text-primary" /> User permissions</CardTitle>
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
        </TabsContent>
      </Tabs>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save all changes
        </Button>
      </div>
    </div>
  );
}

/* ─── Reusable sub-components ─── */

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}

function ApiKeyField({
  label, value, showKey, onToggle, onChange,
}: {
  label: string; value: string; showKey: boolean; onToggle: () => void; onChange: (v: string) => void;
}) {
  const isMasked = value.includes("••••");
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        {value && <Badge variant={isMasked ? "muted" : "success"} className="text-xs">
          {isMasked ? "Saved" : "Set"}
        </Badge>}
      </div>
      <div className="flex gap-2">
        <Input
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter API key…"
          className="font-mono text-xs"
        />
        <Button type="button" variant="outline" size="icon" onClick={onToggle} className="shrink-0">
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {isMasked && (
        <p className="text-xs text-muted-foreground">Key is saved. Type a new value to replace it.</p>
      )}
    </div>
  );
}

function IntegrationField({
  name, description, apiKey, status, showKey, onToggleKey, onChangeKey, onStatusChange,
}: {
  name: string; description: string; apiKey: string; status: string;
  showKey: boolean; onToggleKey: () => void; onChangeKey: (v: string) => void; onStatusChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-7 w-auto text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Connected">Connected</SelectItem>
            <SelectItem value="Disconnected">Disconnected</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onChangeKey(e.target.value)}
          placeholder="Enter API key…"
          className="font-mono text-xs"
        />
        <Button type="button" variant="outline" size="icon" onClick={onToggleKey} className="shrink-0">
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
