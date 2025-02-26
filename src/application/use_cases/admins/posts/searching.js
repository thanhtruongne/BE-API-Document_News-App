
const searchingDataPost = async(payloadEntities,postRepository) => {
     const { categories_id, search_query, startDate,endDate, status } = payloadEntities;

     const excludedFields = ['page', 'sort', 'select'];
     excludedFields.forEach(el => delete payloadEntities[el]);
     let params_query = {}
    //  let queryStr = JSON.stringify(payloadEntities);
    //  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    //  queryStr = JSON.parse(payloadEntities);
    
     if(search_query) {
        // params_query.$title = {$regex : new RegExp(search_query, "i")};
        params_query.title = { $text: { $search: search_query } }
     }
     if(categories_id && categories_id.length > 0) {
        params_query.categories_id = {$in : categories_id};
     }
     if(status) {
        params_query.status = status;
     }
     if(startDate) {
    //     let convert_start_date = moment(startDate,'DD-MM-YYYY').toDate();
    //    if(endDate) {
    //     let convert_end_date = moment(endDate,'DD-MM-YYYY').toDate();
    //      params_query.createdAt = {$gte : convert_start_date}
    //    } else {
    //     params_query.createdAt[] = {$gte : convert_start_date}
    //    }
     }
     let query = await postRepository.findDetail({...params_query})
      
    
  
    // const response = await postRepository.searchingData(payloadEntities);

    // return response;
}



export default searchingDataPost;



