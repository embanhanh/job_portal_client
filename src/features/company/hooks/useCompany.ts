import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/services/company/company.service";
import { COMPANY_KEYS } from "../constants/company.constant";
import { CreateCompanyDto } from "../types/company.type";

/**
 * Hook lấy thông tin công ty của user hiện tại.
 */
export const useMyCompany = () => {
  return useQuery({
    queryKey: [COMPANY_KEYS.MY_COMPANY],
    queryFn: () => companyService.getMyCompany(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook đăng ký công ty mới.
 */
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyDto) => companyService.createCompany(data),
    onSuccess: () => {
      // Invalidate query để cập nhật UI ngay lập tức
      queryClient.invalidateQueries({ queryKey: [COMPANY_KEYS.MY_COMPANY] });
    },
  });
};

/**
 * Hook cập nhật công ty.
 */
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateCompanyDto>) =>
      companyService.updateMyCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_KEYS.MY_COMPANY] });
    },
  });
};
