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

