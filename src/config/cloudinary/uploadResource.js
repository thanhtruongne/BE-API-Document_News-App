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
                resovle(result)
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
      const response = cloudinary.url(public_id,{secure : true});
      return response
   } catch (error) {
        throw new BusinessLogicError(error.message);
   }
}


const destroyImageURL = async(public_id) => {
    try {
       const response = await cloudinary.uploader.destroy(public_id);
       return response
    } catch (error) {
         throw new BusinessLogicError(error.message);
    }
 }

export { destroyImageURL, generateImageURL, uploadMultipleResource, uploadResourceSingle }

