
const countComment = async (query, commentRepository) => {
    const response = await commentRepository.countDocumentQuery(query)

    return response


}
export default countComment;



