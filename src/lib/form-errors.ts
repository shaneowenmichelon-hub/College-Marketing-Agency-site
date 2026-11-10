/** Field messages from a 422 body. Only keys the server actually sent are kept. */
export function serverFieldErrors(value: unknown): Partial<Record<string, string>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Partial<Record<string, string>> = {};
  for (const [key, message] of Object.entries(value)) {
    if (typeof message !== "string") continue;
    const trimmed = message.trim();
    if (!trimmed) continue;
    out[key] = trimmed;
  }
  return out;
}
