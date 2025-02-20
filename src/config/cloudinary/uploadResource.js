import streamifier from 'streamifier'
import cloudinary from "./cloudinary.js"



const uploadResourceSingle = (file) => {
  return new Promise(async(resovle,reject) => {
        const response = await cloudinary.uploader.upload_stream({
            folder : "BlogApp"
        }, (error,result) => {
            if(result)
                resovle(result)
            else
            reject(error)
        })
        // khi resovle thành cọng thì strem lên cloudinay and upload
        streamifier.createReadStream(file?.buffer).pipe(response)
  })

}

const uploadMultipleResource = (files) => {
    return Promise.all(files.map(file => {
        return new Promise((resolve,reject) => {
            try {
                const response =  cloudinary.uploader.upload_stream({
                    folder : "BlogApp"
                }, (error,result) => {
                    if (error) 
                        return reject(error);
                    resolve(result);
                })
                streamifier.createReadStream(file?.buffer).pipe(response)
            } catch (error) {
                reject(error)
            }
        })
    }))
}

export { uploadMultipleResource, uploadResourceSingle }

