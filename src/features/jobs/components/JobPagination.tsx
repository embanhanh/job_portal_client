"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface JobPaginationProps {
  currentPage: number;
  lastPage: number;
}

export function JobPagination({ currentPage, lastPage }: JobPaginationProps) {
  const t = useTranslations("jobs.pagination");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (lastPage <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    router.push(createPageURL(page));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageURL(1)} onClick={(e) => handlePageChange(e, 1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={createPageURL(i)}
            onClick={(e) => handlePageChange(e, i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={lastPage}>
          <PaginationLink
            href={createPageURL(lastPage)}
            onClick={(e) => handlePageChange(e, lastPage)}
          >
            {lastPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className="pt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            onClick={(e) => {
              if (currentPage <= 1) e.preventDefault();
              else handlePageChange(e, currentPage - 1);
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        
        {renderPageNumbers()}
        
        <PaginationItem>
          <PaginationNext
            href={currentPage < lastPage ? createPageURL(currentPage + 1) : "#"}
            onClick={(e) => {
              if (currentPage >= lastPage) e.preventDefault();
              else handlePageChange(e, currentPage + 1);
            }}
            className={currentPage >= lastPage ? "pointer-events-none opacity-50" : ""}
            aria-disabled={currentPage >= lastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
