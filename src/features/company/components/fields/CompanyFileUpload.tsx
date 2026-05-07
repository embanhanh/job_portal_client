"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CompanyFileUploadProps {
  name: string;
  label: string;
  accept?: string;
  required?: boolean;
}

export function CompanyFileUpload({
  name,
  label,
  accept = "image/*,.pdf",
  required = false,
}: CompanyFileUploadProps) {
  const t = useTranslations("company.registration.form");
  const { control, setValue, watch } = useFormContext();
  const file = watch(name) as File | undefined;
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file && file instanceof File && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(name, selectedFile, { shouldValidate: true });
    }
  };

  const handleRemove = () => {
    setValue(name, undefined, { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-6 transition-all hover:bg-muted/10",
                file && "border-primary/50 bg-primary/5"
              )}
            >
              {file ? (
                <div className="flex w-full items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm border">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="rounded-full p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{t("upload_hint")}</p>
                    <p className="text-xs text-muted-foreground">
                      {accept.replace(/\./g, "").toUpperCase()}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
