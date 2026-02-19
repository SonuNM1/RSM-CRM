// Converts start & end dates into MongoDB-compatible range. Inclusive of both start and end dates 

export const parseDateRange = (startDate, endDate) => {
    if(!startDate && !endDate) return null ; 

    const range = {} ; 

    if(startDate){
        const start = new Date(startDate) ; 
        start.setHours(0, 0, 0, 0) ; // start of day 
        range.$gte = start ; 
    }

    if(endDate){
        const end = new Date(endDate) ; 
        end.setHours(23, 59, 59, 999) ; 
        range.$lte = end ; 
    }

    return range ; 

}