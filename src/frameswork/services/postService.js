import moment from "moment";
import { destroyCloudinaryURL, uploadMultipleResource, uploadResourceSingle, uploadVideoResource } from "../../config/cloudinary/uploadResource.js";
import { BusinessLogicError } from "../web/plugins/error.response.js";


const postService = () => {
    const updateImage = async(public_id,file) => {
        try {
            //xoa publicID
            await destroyCloudinaryURL(public_id);

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
            public_ids.map(async(item) => await destroyCloudinaryURL(item) )

            //generate publicID
            const response = await uploadMultipleResource(files);
            return response;
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError(error?.message || "Some thing went wrong")
        }
    }

    const updateVideos = async(public_id,files) => {
        try {
            //xoa publicID
            await destroyCloudinaryURL(public_id);
            const response = await uploadVideoResource(files);
            return response
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError(error?.message || "Some thing went wrong")
        }
    }

    const searchingParamsService = async(payload) => {
        const { categories_id, text , createdAt,author_id, status } = payload;
        if(createdAt) {
            createdAt.gte =  moment(createdAt?.gte, 'DD-MM-YYYY').toDate() ?? null;    
            if(createdAt.lte) {
                createdAt.lte =  moment(createdAt?.lte, 'DD-MM-YYYY').toDate() ?? null;
            }
        }

        const excludedFields = ['page', 'sort', 'select'];
        excludedFields.forEach(el => delete payload[el]);
        let queryStr = JSON.stringify(payload);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|search|text)\b/g, match => `$${match}`)
        queryStr = JSON.parse(queryStr);
        
        if(categories_id && categories_id?.length > 0) {
            queryStr.categories_id = {$in : categories_id};
        }
        if(status) {
            queryStr.status = status;
        }
        if(author_id && author_id?.length > 0 ) {
            queryStr.author_id = {$in : author_id};
        }
        return {...queryStr}
    }
 
     return {
        updateImage,
        updateMultipleImages,
        searchingParamsService,
        updateVideos
     }
}

export default postService