const userEntities = ({
    _id = null, 
    email = null,
    role = null ,
    full_name = null ,
    phone = null,
    address = null,
    status = "Active",
    password = null,
    avatar = null,
}) => {

    return  {

        getUserID: () => _id,
        getEmail: () => email,
        getRole: () => role,
        getFullName: () => full_name,
        getPhone: () => phone,
        getAddress: () => address,
        getStatus: () => status,
        getPassword: () => password,
        getAvatar: () => avatar,
    }
}

export default userEntities