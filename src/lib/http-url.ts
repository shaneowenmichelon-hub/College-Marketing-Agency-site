/** True when a credit or license value can be used as an href. */
export function httpUrl(value?: string): string | undefined {
  const trimmed = value?.trim() ?? "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}
