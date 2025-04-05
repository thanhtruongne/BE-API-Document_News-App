const notifyEntities = ({
    _id = null, 
    title = null,
    full_name =  null,
    link = null,
    content = null ,
    postId = null,
    type = null,
    recipient = null,
    read = false,
    author = null,
}) => {

    return  {
        getID: () => _id,
        getFullName: () => full_name,
        getLink :() => link,
        getContent: () => content,
        getPostID: () => postId,
        getType: () => type,
        getRecipient: () => recipient,
        getRead: () => read,
        getAuthor: () => author,
        getTitle: () => title,
    }
}

export default notifyEntities