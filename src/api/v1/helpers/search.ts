export const searchHelper = (query: any) => {
  let objSearch: { keyword: string; regex: RegExp } = {
    keyword: "",
    regex: new RegExp("", "i"), // default rỗng
  };

  if (query.keyword) {
    objSearch.keyword = query.keyword;
    objSearch.regex = new RegExp(objSearch.keyword, "i");
  }

  return objSearch;
};
