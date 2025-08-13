import i18n from "../../../../config/i18n/i18n.config.js";
import { Api401Error, Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";
import constants from "../../../../utils/constants.js";

/**
 * @param {string} id - User ID
 * @param {object} payload - Request payload
 * @param {object} userRepository - User repository instance
 * @param {object} userService - User service instance
 * @returns {object} Updated user data
 */
const changeFieldsData = async (_id, payload, userRepository, userService) => {
    const { type, currentPassword, newPassword, newEmail, passwordChangeMail, avatar, full_name } = payload

    if (!_id || !type) {
        throw new Api401Error(i18n.translate('error.not_found.data'))
    }


    const user = await userRepository.findByQuery({ _id, status: 'Active' }, '_id email password avatar status')
    if (!user) {
        throw new Api403Error(i18n.translate('error.not_found.data'))
    }

    // Define field selection for each operation type
    const getFieldsToSelect = (operationType) => {
        switch (operationType) {
            case constants.CHANGE_PASSWORD:
                return 'email full_name _id role status';
            case constants.AVATAR:
                return 'email full_name avatar imageURL _id status';
            default:
                return 'email full_name avatar imageURL _id status';
        }
    };

    switch (type) {
        case constants.EMAIL_CHANGE:
            if (!passwordChangeMail || !newEmail) {
                throw new Api401Error(i18n.translate('error.not_found.data'))
            }

            if (!await userService.comparePassword(passwordChangeMail, user.password)) {
                throw new Api403Error(i18n.translate('errors.password_invalid'))
            }

            return await userRepository.updateDataByQuery(_id, { email: newEmail }, getFieldsToSelect(type));

        case constants.FULL_NAME:
            if (!full_name) {
                throw new Api401Error(i18n.translate('error.not_found.data'))
            }

            return await userRepository.updateDataByQuery(_id, { full_name }, getFieldsToSelect(type));

        case constants.AVATAR:
            if (!avatar) {
                throw new Api403Error(i18n.translate('errors.invalid_image'))
            }

            const imageUpload = await userService.uploadAvatarImage(user.avatar, avatar)
            console.log(imageUpload, 'imageUpload')
            if (!imageUpload) {
                throw new BusinessLogicError(i18n.translate('errors.upload_image'))
            }

            return await userRepository.updateDataByQuery(_id, { avatar: imageUpload }, getFieldsToSelect(type));

        case constants.CHANGE_PASSWORD:
            if (!currentPassword || !newPassword) {
                throw new Api401Error(i18n.translate('error.not_found.data'))
            }

            if (!await userService.comparePassword(currentPassword, user.password)) {
                throw new Api403Error(i18n.translate('errors.password_invalid'))
            }

            const hashedPassword = await userService.hashPassword(newPassword)
            return await userRepository.updateDataByQuery(_id, { password: hashedPassword }, getFieldsToSelect(type));

        default:
            return null;
    }
};

export default changeFieldsData

