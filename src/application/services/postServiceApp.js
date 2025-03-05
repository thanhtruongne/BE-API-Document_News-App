
const postServiceApp = (postService) => {

    const updateImage = async(public_id,file) => await postService.updateImage(public_id,file)

    const updateMultipleImages = async(public_ids,files) => await postService.updateMultipleImages(public_ids,files)

    const searchingParamsService = async(payload) => await postService.searchingParamsService(payload)

    const updateVideos = async(public_id,files) => await  postService.updateVideos(public_id,files)
    return {
        updateImage,
        updateMultipleImages,
        searchingParamsService,
        updateVideos
    }
}

export default postServiceApp