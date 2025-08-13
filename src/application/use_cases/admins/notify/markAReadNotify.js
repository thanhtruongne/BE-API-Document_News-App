import i18n from "../../../../config/i18n/i18n.config.js";
import { Api404Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";

const markAReadNotify = async (id, type, notifyRepository) => {

    if (!id) {
        throw new Api404Error(i18n.translate('Missing parameter.'))
    }
    try {
        const response = await notifyRepository.updateOneById(id, { markAread: true });
        return response;

    } catch (error) {
        throw new BusinessLogicError(error.message)
    }
}
export default markAReadNotify;



