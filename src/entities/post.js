const postEntities = ({
    _id = null, 
    title = null,
    description = null ,
    content = null ,
    categories_id = null,
    thumb = null,
    images = null,
    isTrending = false,
    status = "Active",
}) => {
    return  {
        getID: () => _id,
        getTitle: () => title,
        getDescription: () => description,
        getContent: () => content,
        getCategoriesID: () => categories_id,
        getThumb: () => thumb,
        getIsTrending : () => isTrending,
        getImages : () => images,
        getStatus: () => status,
    }
}

export default postEntities