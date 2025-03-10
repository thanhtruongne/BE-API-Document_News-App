const settingEntities = ({
    _id = null, 
    logo =  null,
    dataJson = null,
}) => {

    return  {
        getID: () => _id,
        getLogo: () => logo,
        getSataJson: () => dataJson,
    }
}


export default settingEntities      