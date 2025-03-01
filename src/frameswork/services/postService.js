import { destroyImageURL, uploadMultipleResource, uploadResourceSingle } from "../../config/cloudinary/uploadResource.js";
import { BusinessLogicError } from "../web/plugins/error.response.js";


const postService = () => {
    const updateImage = async(public_id,file) => {
        try {
            //xoa publicID
            await destroyImageURL(public_id);

            //generate publicID
            const response = await uploadResourceSingle(file);
            return response;
        } catch (error) {   
            console.log(error);
            throw new BusinessLogicError(error?.message || "Some thing went wrong")
        }
    }

    const updateMultipleImages = async(public_ids,files) => {
        try {
            //xoa publicID
            public_ids.map(async(item) => await destroyImageURL(item) )

            //generate publicID
            const response = await uploadMultipleResource(files);
            return response;
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError(error?.message || "Some thing went wrong")
        }
    }
 
     return {
        updateImage,
        updateMultipleImages
     }
}

export default postService