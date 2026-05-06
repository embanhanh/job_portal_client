// lib/api/locale.ts

export const getRequestLocale = async (): Promise<string> => {
  if (typeof window !== "undefined") {
    return document.documentElement.lang || "vi";
  }

  try {
    const { getLocale } = await import("next-intl/server");
    return (await getLocale()) || "vi";
  } catch {
    // Không trong server request context (VD: generateStaticParams)
    return "vi";
  }
};
