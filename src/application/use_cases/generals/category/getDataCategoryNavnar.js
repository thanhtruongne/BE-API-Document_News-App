
const getDataCategoryNav = async(id,categoriesRepository) =>  {
    console.log(categoriesRepository,'categoriesRepositorycategoriesRepository')
    const response  = await categoriesRepository.getTreeData(id);
    return response;

}
export default getDataCategoryNav;  



    