const commentEntities = ({
    _id = null, 
    postId = null,
    author_id = null,
    full_name = null,
    content = null ,
    status = "Active",
    parent_id = null,
    like = 0,
}) => {

    return  {

        getID: () => _id,
        getPostID: () => postId,
        getAuthorID :() => author_id,
        getFullName: () => full_name,
        getContent: () => content,
        getParentID: () => parent_id,
        getStatus: () => status,
        getLike: () => like,
    }
}

export default commentEntities