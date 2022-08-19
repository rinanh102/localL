export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
};

export const getPagingData = (data: any, count: number, page: number, limit: number) => {
    const totalItems = count;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, data, totalPages, currentPage };
};