import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Loại bỏ các trường null, undefined, hoặc chuỗi rỗng từ một object.
 * Hỗ trợ dọn dẹp đệ quy (nested objects).
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // Loại bỏ null, undefined, hoặc ""
    if (value === null || value === undefined || value === "") {
      return;
    }

    // Nếu là object (nhưng không phải File hoặc Array), dọn dẹp đệ quy
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof File)
    ) {
      const cleaned = cleanObject(value);
      // Chỉ giữ lại nếu object con sau khi dọn dẹp vẫn còn dữ liệu
      if (Object.keys(cleaned).length > 0) {
        newObj[key] = cleaned;
      }
      return;
    }

    newObj[key] = value;
  });

  return newObj;
}


/**
 * Lấy giá trị theo ngôn ngữ hiện tại từ object đa ngôn ngữ.
 * Ưu tiên ngôn ngữ hiện tại, sau đó là tiếng Việt, cuối cùng là chuỗi rỗng.
 */
export function getLocalizedValue<T extends { vi: string; en?: string }>(
  value: T | string | undefined | null,
  locale: string
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  
  const localized = value as Record<string, string>;
  return localized[locale] || localized["vi"] || "";
}

/**
 * Format tiền tệ (VND).
 */
export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null) return "Thỏa thuận";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Lấy tên file từ URL (đặc biệt là Cloudinary URL).
 * Loại bỏ các query params và versioning.
 */
export function getFileNameFromUrl(url?: string): string {
  if (!url) return "";
  try {
    const decodedUrl = decodeURIComponent(url);
    const fileNameWithQuery = decodedUrl.split("/").pop() || "";
    const fileName = fileNameWithQuery.split("?")[0];
    
    // Nếu là Cloudinary, nó thường có version (v1234567890) ở phía trước, 
    // nhưng split("/").pop() đã lấy được phần cuối cùng rồi.
    return fileName;
  } catch (error) {
    return "";
  }
}
