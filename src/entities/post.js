const postEntities = ({
    _id = null, 
    title = null,
    description = null ,
    content = null ,
    categories_id = null,
    thumb = null,
    videos = null,
    images = null,
    isTrending = false,
    status = "Active",
    type = null,
    media_type = 1,
    author_id = null
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
        getVideos : () => videos,
        getMediaType : () => media_type,
        getType: () => type,
        getStatus: () => status,
        getAuhtorID: () => author_id,
    }
}

export default postEntities