interface Pagination {
  currentPage: number;
  limitItems: number;
  skip: number;
  totalPage: number;
}

interface QueryParams {
  page?: string;
  limit?: string;
}

export const paginationHelper = (
  objectPagination: Pagination,
  query: QueryParams,
  countRecords: number
): Pagination => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page, 10);
  }
  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit, 10);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems);

  return objectPagination;
};
