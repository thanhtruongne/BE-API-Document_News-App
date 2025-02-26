
const postServiceApp = (postService) => {

    const updateImage = async(public_id) => await postService.updateImage(public_id)

    const updateMultipleImages = async(public_ids,files) => await postService.updateMultipleImages(public_ids,files)


    return {
        updateImage,
        updateMultipleImages
    }
}

export default postServiceApp