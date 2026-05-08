import { http } from "@/lib/api/http";
import { companyEndpoints } from "@/lib/api/endpoints";
import { Company, CreateCompanyDto } from "@/features/company/types/company.type";
import { cleanObject } from "@/lib/utils";

class CompanyService {
  /**
   * Lấy thông tin công ty của user hiện tại.
   */
  async getMyCompany(): Promise<Company> {
    return http.get<Company>(companyEndpoints.ME);
  }

  /**
   * Lấy thông tin công ty theo ID.
   */
  async getById(id: string): Promise<Company> {
    return http.get<Company>(companyEndpoints.BY_ID(id));
  }

  /**
   * Đăng ký công ty mới (multipart/form-data).
   */
  async createCompany(data: CreateCompanyDto): Promise<Company> {
    const formData = this.convertToFormData(data);
    return http.post<Company>(companyEndpoints.BASE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Cập nhật thông tin công ty (multipart/form-data).
   */
  async updateMyCompany(data: Partial<CreateCompanyDto>): Promise<Company> {
    const formData = this.convertToFormData(data);
    return http.patch<Company>(companyEndpoints.ME, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Helper để chuyển đổi DTO sang FormData sạch sẽ.
   */
  private convertToFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    const cleanedData = cleanObject(data);

    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  }
}

export const companyService = new CompanyService();
