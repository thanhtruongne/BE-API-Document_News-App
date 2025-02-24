
const getData = async(params,postRepository) => await postRepository.findAll(params);


export default getData;



