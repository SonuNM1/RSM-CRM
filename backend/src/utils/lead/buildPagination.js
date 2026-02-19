export const buildPagination = (page = 1, limit = 10) => {
    const pageNumber = Math.max(parseInt(page), 1) ; 
    const pageLimit = Math.max(parseInt(limit), 1) ; 

    const skip = (pageNumber - 1) * pageLimit ; 

    return {
        page: pageNumber, 
        limit: pageLimit, 
        skip, 
    }

}