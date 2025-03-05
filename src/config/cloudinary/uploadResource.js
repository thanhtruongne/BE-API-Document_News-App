import streamifier from 'streamifier'
import { BusinessLogicError } from '../../frameswork/web/plugins/error.response.js'
import cloudinary from "./cloudinary.js"

const uploadResourceSingle = (file) => {
  return new Promise(async(resovle,reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("File buffer is undefined"));
        }
        const response = await cloudinary.uploader.upload_stream({
            folder : "BlogApp"
        }, (error,result) => {
            if(result)
                resovle(result.public_id)
            else
            reject(error)
        })
        streamifier.createReadStream(file?.buffer).pipe(response)
  })

}

const uploadMultipleResource = (files) => {
    return Promise.all(files.map(file => {
        return new Promise(async(resolve,reject) => {
            if (!file || !file.buffer) {
                return reject(new Error("File buffer is undefined"));
            }
            const response = await cloudinary.uploader.upload_stream({
                folder : "BlogApp"
            }, (error,result) => {
                if (error) 
                    return reject(error);
                resolve(result.public_id);
            })
            streamifier.createReadStream(file?.buffer).pipe(response)
            
        })
    }))
}

const generateImageURL =(public_id) => {
   try {
    console.log(public_id)
      if(!public_id || public_id == undefined || public_id == 'undefined') {
         return null;
      }
      const response = cloudinary.url(public_id,{secure : true});
      return response
   } catch (error) {
        throw new BusinessLogicError(error.message);
   }
}
const generateVideoURL = (public_id) => {
    try {
       if(!public_id || public_id == undefined || public_id == 'undefined') {
          return null;
       }
       const response = cloudinary.url(public_id, {
          resource_type: "video",
          format: "mp4",
          secure : true
       });

       return response
    } catch (error) {
         throw new BusinessLogicError(error.message);
    }
 }

const destroyCloudinaryURL = async(public_id) => {
    try {
       const response = await cloudinary.uploader.destroy(public_id);
       return response
    } catch (error) {
         throw new BusinessLogicError(error.message);
    }
}



const uploadVideoResource = (file) => {
    return new Promise((resovle,reject) => {
        console.log(file)
        if (!file || !file.buffer) {
            return reject(new Error("File buffer is undefined"));
        }
        const response = cloudinary.uploader.upload_stream({
            folder : "BlogApp/Videos",
            format : 'mp4',
            resource_type : 'video',
            transformation : [
                { width: 1080, height: 720, crop: "limit" }, 
                { quality: "auto" }
            ]
        }, (error,result) => {
            if(result)
                resovle(result.public_id)
            else
            reject(error)
        })
        streamifier.createReadStream(file?.buffer).pipe(response)
  })
}

export { destroyCloudinaryURL, generateImageURL, generateVideoURL, uploadMultipleResource, uploadResourceSingle, uploadVideoResource }

