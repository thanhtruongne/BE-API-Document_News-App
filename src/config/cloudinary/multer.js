import multer from "multer";



const uploadData = multer({
    storage : multer.memoryStorage(),
    fileFilter : (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Chỉ chấp nhận tệp hình ảnh'), false); 
          }
    }
    // limits: {
    //     fileSize: 2 * 1024 * 1024, // 2 MB
    // },
})


export default uploadData