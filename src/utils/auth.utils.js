import jwt from "jsonwebtoken"




const createTokenAccessData = async(payload,publicKey,privateKey) => {
  try {
    const access_token = jwt.sign(payload,privateKey,{
        algorithm : 'RS256',
        expiresIn : '2 days'
    })
    
    const refresh_token = jwt.sign(payload,privateKey,{
        algorithm : 'RS256',
        expiresIn : '7 days'
    })

    verifyJwt(access_token,publicKey,(err,decode) => {
        if(err) {
            throw new Error(err);
        }
    })

    return {
        access_token,
        refresh_token
    }
    

  } catch (error) {
        console.log('error for create key token')
        throw new Error(error);
  }
}


const verifyJwt = (token, keySecret) => {
    return jwt.verify(token, keySecret);
}



export {
    createTokenAccessData
}