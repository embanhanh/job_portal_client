"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { FileText, Upload, Loader2, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, getFileNameFromUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCandidateCv } from "../hooks/useCandidateCv";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Cấu hình worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CandidateCvSectionProps {
  cvUrl?: string;
}

export function CandidateCvSection({ cvUrl }: CandidateCvSectionProps) {
  const t = useTranslations("profile.candidate");
  const { isUploading, handleUpload } = useCandidateCv();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [numPages, setNumPages] = React.useState<number>(0);

  const fileName = getFileNameFromUrl(cvUrl);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("cv")}</h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-2 border-dashed rounded-xl bg-muted/5">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <FileText className="h-8 w-8" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          {cvUrl ? (
            <div className="space-y-1">
              <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
                {fileName || "CV_Current.pdf"}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-primary font-medium"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {t("preview_cv")}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("no_cv")}</p>
          )}
        </div>

        <div className="relative">
          <input
            type="file"
            id="cv-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById("cv-upload")?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {cvUrl
              ? t("change_cv", { fallback: "Thay đổi CV" })
              : t("upload_cv")}
          </Button>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{t("preview_cv")}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full bg-muted overflow-auto p-4 flex justify-center">
            <Document
              file={cvUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Loader2 className="h-8 w-8 animate-spin" />}
              className="flex flex-col gap-4"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                  className="shadow-lg"
                  width={Math.min(window.innerWidth * 0.8, 800)}
                />
              ))}
            </Document>
          </div>
          <div className="p-4 border-t flex justify-end gap-2 bg-background">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              {t("cancel", { fallback: "Đóng" })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
