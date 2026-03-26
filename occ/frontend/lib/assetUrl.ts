import { API_BASE } from "@/lib/api";

const LOCAL_UPLOAD_HOST_PATTERN = /^(localhost|127\.0\.0\.1)$/i;

export const API_ORIGIN = API_BASE.replace(/\/api(?:\/v1)?\/?$/i, "").replace(/\/+$/, "");

export function resolveAssetUrl(value?: string | null, fallback?: string) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith("blob:") || trimmed.startsWith("file:")) {
    return trimmed;
  }

  if (/^[a-zA-Z]:[\\/]/.test(trimmed)) {
    return fallback;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        if (LOCAL_UPLOAD_HOST_PATTERN.test(parsed.hostname)) {
          return `${API_ORIGIN}${parsed.pathname}`;
        }

        if (typeof window !== "undefined" && window.location.protocol === "https:" && parsed.protocol === "http:") {
          return `${API_ORIGIN}${parsed.pathname}`;
        }
      }
      return trimmed;
    } catch {
      return fallback ?? trimmed;
    }
  }

  if (/^(\/)?uploads\//i.test(trimmed)) {
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_ORIGIN}${normalized}`;
  }

  return trimmed;
}
