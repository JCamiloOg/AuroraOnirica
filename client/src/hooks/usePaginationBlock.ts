export default function usePagination(totalPages: number, currentPage: number) {
    const pagesToShow = 5;
    const margin = Math.floor(pagesToShow / 2);

    let startPage = currentPage - margin;
    let endPage = currentPage + margin;

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(pagesToShow, totalPages);
    }

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const pages = [];

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return pages;
}