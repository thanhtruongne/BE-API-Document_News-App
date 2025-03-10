import { destroyCloudinaryURL, uploadResourceSingle } from "../../../../config/cloudinary/uploadResource.js";
import settingEntities from "../../../../entities/setting.js";
const storeDataSetting = async(payloadEntities,settingRepository) => {
    const {logo, dataJson, id } = payloadEntities
    
    const check_exists = null;
    if(id) {
        check_exists = await settingRepository.findDetail(id)
    }

    if(check_exists && check_exists.logo && logo) {
        await destroyCloudinaryURL(check_exists.logo)
    }

    const public_id_logo = await uploadResourceSingle(logo);

    console.log(public_id_logo)
    
    const dataEntities = settingEntities({
        logo : public_id_logo, 
        dataJson
    })

    const response = await settingRepository.storeDataSetting(id,dataEntities);

    return response;
}



export default storeDataSetting;



