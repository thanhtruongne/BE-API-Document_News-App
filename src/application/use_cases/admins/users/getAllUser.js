
const getAllUser = async(params,userRepository) => await userRepository.findAll(params);


export default getAllUser;



