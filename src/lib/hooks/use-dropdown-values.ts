"use client";

import { useEffect, useState } from "react";
import type { DropdownValuesConfig } from "@/lib/config";

/**
 * Client hook to fetch dropdown values from /api/settings.
 * Returns the full dropdownValues config, or null while loading.
 */
export function useDropdownValues() {
  const [values, setValues] = useState<DropdownValuesConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/settings", { credentials: "same-origin" });
        if (!res.ok) return;
        const data = await res.json();
        // GET /api/settings returns the settings object directly
        const dv = data.dropdownValues ?? data.settings?.dropdownValues;
        if (!cancelled && dv) {
          setValues(dv);
        }
      } catch {
        // silent — forms will fall back to constants
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { values, loading };
}
