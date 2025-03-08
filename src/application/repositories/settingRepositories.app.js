export default function settingRepositoriesApp(repository) {
    const getDataSetting = (params) => repository.findAll(params);

    const storeDataSetting = (_id,payload) => repository.storeData(_id,payload);

    const findDetail = (_id) => repository.findDetail(_id);

    

    
    return {
        getDataSetting,
        storeDataSetting,
        findDetail
    };
}
