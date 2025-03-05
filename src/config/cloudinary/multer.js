import multer from "multer";



const uploadData = multer({
    storage : multer.memoryStorage(),
    // limits: {
    //     fileSize: 2 * 1024 * 1024, // 2 MB
    // },
})


export default uploadData