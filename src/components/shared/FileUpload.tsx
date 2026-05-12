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
} from "@/components/ui/form";
import { cn, formatFileSize } from "@/lib/utils";
import { ServerAwareFormMessage } from "@/features/auth/components/ServerAwareFormMessage";
import { FormMessage } from "@/components/ui/form";

interface FileUploadProps {
  name: string;
  label?: string;
  accept?: string;
  required?: boolean;
  maxSizeMB?: number;
  className?: string;
  showPreview?: boolean;
  tValidation?: any;
}

export function FileUpload({
  name,
  label,
  accept = "image/*,.pdf",
  required = false,
  maxSizeMB = 5,
  className,
  showPreview = true,
  tValidation,
}: FileUploadProps) {
  const t = useTranslations("common.file_upload");
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fileValue = field.value as File | undefined;

        // Internal effect for preview handled inside render to stay in sync with field value
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [preview, setPreview] = React.useState<string | null>(null);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          if (
            showPreview &&
            fileValue &&
            fileValue instanceof File &&
            fileValue.type.startsWith("image/")
          ) {
            const url = URL.createObjectURL(fileValue);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
          } else {
            setPreview(null);
          }
        }, [fileValue, showPreview]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            field.onChange(selectedFile);
          }
        };

        const handleRemove = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          field.onChange(undefined);
        };

        const formatLabel = accept.replace(/\./g, "").toUpperCase();

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-6 transition-all hover:bg-muted/10",
                  fileValue && "border-primary/50 bg-primary/5",
                  fieldState.error && "border-destructive/50 bg-destructive/5"
                )}
              >
                {fileValue ? (
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
                      <p className="truncate text-sm font-medium">
                        {fileValue.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileValue.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemove}
                      title={t("remove")}
                      className="rounded-full p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{t("upload_hint")}</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {t("format", { format: formatLabel })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("max_size", { size: maxSizeMB })}
                        </p>
                      </div>
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
            {tValidation ? (
              <ServerAwareFormMessage tCommon={tValidation} />
            ) : (
              <FormMessage />
            )}
          </FormItem>
        );
      }}
    />
  );
}
