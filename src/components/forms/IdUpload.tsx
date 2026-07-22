"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPT_ATTR, humanFileSize } from "@/lib/uploads";

/**
 * Single-file ID photo picker with thumbnail preview, remove/replace, and mobile
 * camera capture. The file is held in parent state and uploaded only on submit —
 * the object URL never leaves the browser.
 */
export function IdUpload({
  id,
  label,
  file,
  onFile,
  error,
  required,
}: {
  id: string;
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
  error?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Local object URL for image previews; revoked on change/unmount.
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>

      {file ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-[3px] border-2 bg-white p-3",
            error ? "border-red-500" : "border-ink",
          )}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border-2 border-ink bg-surface-muted">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="ID preview" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-6 w-6 text-[color:var(--muted-on-light)]" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <p className="mono-label text-[10px] text-[color:var(--muted-on-light)]">
              {humanFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={`Remove ${label}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border-2 border-ink bg-white text-ink hover:bg-surface-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-[3px] border-2 border-dashed bg-surface-muted/50 px-4 py-7 text-center transition-colors hover:bg-surface-muted",
            error ? "border-red-500" : "border-ink",
          )}
        >
          <Camera className="h-6 w-6 text-[color:var(--muted-on-light)]" aria-hidden />
          <span className="text-sm font-medium text-ink">Tap to upload or take a photo</span>
          <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">
            JPG · PNG · HEIC · PDF · max 10MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_ATTR}
        capture="environment"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        aria-invalid={!!error}
      />

      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
