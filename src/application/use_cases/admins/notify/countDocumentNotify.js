import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";

const countDocumentNotify = async (query, notifyRepository) => {
    try {
        const response = await notifyRepository.countDocumentByQuery(query);
        return response;
    } catch (error) {
        throw new Api403Error(error.message)
    }
}
export default countDocumentNotify;



