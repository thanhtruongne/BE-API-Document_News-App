
const getDataCategoryNav = async(id,categoriesRepository) =>  {
    const response  = await categoriesRepository.getTreeData(id);
    return response;

}
export default getDataCategoryNav;  



    