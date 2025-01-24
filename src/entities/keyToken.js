const keyTokenEntities = ({
    _id, email, role ,publicKey = null ,refrehToken = null,refreshTokenUsed = [] 
}) => {

    return  {
        getUserID: () => _id,
        getEmail: () => email,
        getRole: () => role,
        getPublicKey: () => publicKey,
        getRefreshToken: () => refrehToken,
        getRefreshTokeUsed: () => refreshTokenUsed,
    }
}

export default keyTokenEntities