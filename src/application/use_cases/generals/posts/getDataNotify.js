
const getDataNotify = async(params,postRepository) =>  {
    params.select ='-description -content -comment -updatedAt -thumb -images -isTrending -media_type -videos -type'
    const response  = await postRepository.findAll(params);

    return response;

}
export default getDataNotify;  



    