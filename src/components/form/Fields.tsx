"use client";

import {
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Check, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-[3px] border-2 bg-white px-4 py-3 text-sm text-ink placeholder:text-[color:var(--muted-on-light)]/70 transition-shadow focus:outline-none focus:shadow-[3px_3px_0_var(--accent)]";

function borderClass(error?: string) {
  return error ? "border-red-500 focus:border-red-500" : "border-ink";
}

/** Label + error wrapper shared by all fields. */
export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[color:var(--muted-on-light)]">{hint}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: string };
export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(controlBase, borderClass(error), className)}
      aria-invalid={!!error}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  children: ReactNode;
};
export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(controlBase, borderClass(error), "appearance-none pr-10", className)}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </select>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string };
export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(controlBase, borderClass(error), "min-h-28 resize-y", className)}
      aria-invalid={!!error}
      {...props}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  error,
  name,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  name?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
            aria-invalid={!!error}
          />
          <span
            className={cn(
              "h-5 w-5 rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40",
              checked ? "border-accent bg-accent" : "border-[color:var(--border-on-light)] bg-white",
              error && !checked && "border-red-400",
            )}
          />
          {checked && (
            <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white" aria-hidden />
          )}
        </span>
        <span className="text-sm leading-snug text-[color:var(--muted-on-light)]">
          {label}
        </span>
      </label>
      {error && (
        <p className="ml-8 mt-1 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Client-only file picker. Shows the selected filename; performs NO upload.
 * TODO: wire to real storage (S3 / UploadThing) in the secure portal, not here.
 */
export function FileDrop({
  label,
  accept,
  onFile,
  file,
}: {
  label: string;
  accept?: string;
  onFile: (file: File | null) => void;
  file: File | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0] ?? null;
          if (f) onFile(f);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging
            ? "border-accent bg-accent/5"
            : "border-[color:var(--border-on-light)] bg-surface-muted/50",
        )}
      >
        <UploadCloud className="h-6 w-6 text-[color:var(--muted-on-light)]" aria-hidden />
        <p className="text-sm text-[color:var(--muted-on-light)]">
          {label}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 rounded-full border border-[color:var(--border-on-light)] px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-white"
        >
          Choose file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2 text-sm">
          <span className="truncate text-ink">{file.name}</span>
          <button
            type="button"
            onClick={() => onFile(null)}
            aria-label="Remove file"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--muted-on-light)] hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
