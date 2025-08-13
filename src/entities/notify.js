const notifyEntities = ({
    _id = null, 
    content = null,
    url = null,
    subject = null ,
    postId = null,
    type = null,
    userId = null,
    markAread = false,
    timeMarkRead = null,
    status = null,
}) => {
    return  {
        getID: () => _id,
        getSubject :() => subject,
        getContent: () => content,
        getPostID: () => postId, 
        getType: () => type,
        getURL: () => url,
        getUserID: () => userId,
        getMarkAread: () => markAread,
        getStatus: () => status,
        getTimeMarkRead : () => timeMarkRead
    }
}
export default notifyEntities;