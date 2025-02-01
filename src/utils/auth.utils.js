import crypto from "crypto"
import JWT from "jsonwebtoken"
import userRepositoriesApp from "../application/repositories/userRepositories.app.js"
import i18n from "../config/i18n.config.js"
import userRepositoryDB from "../frameswork/databases/mongoDB/repositories/userRepositoriesDB.js"
import { Api401Error, Api403Error, Api404Error } from "../frameswork/web/plugins/error.response.js"
import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc.js"
import { checkEmptyVal, checkPasswordValid, checkValidatePhone, isValidEmail } from './index.utils.js'


const HEADER = {
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token',
    X_CLIENT_ID: 'x-client-id',
    BEARER: 'Bearer'
}

const ADMIN_FEATURE = {
    ADMIN : 'Admin'
}


const createTokenAccessData = async(payload,publicKey,privateKey) => {
  try {
    const access_token = JWT.sign(payload,privateKey,{
        algorithm: 'RS256',
        expiresIn : '2d'
    })
    
    const refresh_token = JWT.sign(payload,privateKey,{
        algorithm: 'RS256',
        expiresIn : '7d'
    })

    JWT.verify(access_token, publicKey,(err,decoded) => {
        if(err) {
            console.log(err)
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
const extractToken = (tokenHeader) => {
    if (!tokenHeader || checkEmptyVal(tokenHeader)) return "";
    return tokenHeader.split(' ')[1]
}

const convertPublicKeyObecjt = (publicKey) => {
    return  crypto.createPublicKey(publicKey);
}

const verifyJWT = (token, keySecret) => {
    return  JWT.verify(token, keySecret);
}

const parseJWT = (token) => JSON.parse(Buffer?.from(token?.split('.')[1], 'base64').toString());

const authencation = catchingAsyncAwait(async(req,res,next) => {
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const userRepo = userRepositoriesApp(userRepositoryDB())
    // const refreshToken = extractToken(req.headers[HEADER.REFRESH_TOKEN])
    // const accessToken = extractToken(req.headers[HEADER.AUTHORIZATION])
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    const accessToken = req.headers[HEADER.AUTHORIZATION]

       

    if((accessToken == 'undefined' || clientId == 'undefined')) {
        return next(new Api403Error(i18n.translate('error.not_found.data')))
    }
    const parseTokens = (accessToken === 'undefined' || accessToken == null) ? refreshToken : accessToken

    const obj = parseJWT(parseTokens)
    if (!obj.userID) return next(new Api403Error(i18n.translate('error.not_found.data')))
      
    const userId = clientId || obj.userID;
    if (!userId) return next(new Api403Error(i18n.translate('error.not_found.data')))

    const store = await userRepo.findUserKeyTokenID(userId)
    if (!store) return next(new Api404Error(i18n.translate('error.user_id.not_found')))
      
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, convertPublicKeyObecjt(store.publicKey),[{algorithms : 'RS256'}]);
            if (userId !== decodeUser.userID) return next(new Api401Error(i18n.translate('error.user_id.not_found')))
        
            req.user = decodeUser
            req.store = store
            req.refreshToken = refreshToken
          
            return next()
        }  catch (error) {
            throw error
        }
    }

    if (!accessToken) return next(new Api403Error(i18n.translate('error.invalid.request')))
    try { 
        const decodeUser = verifyJWT(accessToken, store.publicKey);
        if (userId !== decodeUser.userID) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

        req.user = decodeUser
        req.store = store
        return next()
    } catch (error) {
        throw error
    }
})


const AuthencatedProvideAdmin = catchingAsyncAwait(async(req,res,next) => {
    const userRepo = userRepositoriesApp(userRepositoryDB())
    const _id = req.user?.userID
  
    if(!_id) {
        return next(new Api401Error(i18n.translate('error.user_id.not_found')))  
    }
    debugger
    const users = await userRepo.findByQuery({
        _id, status : 'Active'
    },{
        role : 1
    })
   
    if(users?.role == ADMIN_FEATURE.ADMIN) {
        return next();
    } else {
        return next(new Api404Error(i18n.translate('error.user_id.not_found')))
    }
    
})


const validateRequestSignIn = (payload) => {
    if(checkEmptyVal(payload?.email) || checkEmptyVal(payload?.phone) || checkEmptyVal(payload?.full_name) || checkEmptyVal(payload?.password)) {
         throw new Api403Error(i18n.translate('error.required.field'));
    }
    if(!isValidEmail(payload?.email)) {
         throw new Api403Error(i18n.translate('error.Invalid.email'));
    }
    if(!checkPasswordValid(payload?.password)) {
         throw new Api403Error(i18n.translate('error.Invalid.password'));
    }
    if(!checkValidatePhone(payload?.phone)) {
         throw new Api403Error(i18n.translate('error.Invalid.phone'));
    }
    return true;
 }
 
 const validateRequestLogin = (payload) => {
    if(checkEmptyVal(payload?.email) || checkEmptyVal(payload?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
    }
    if(!isValidEmail(payload?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
    }

    return true;
 }

export {
    AuthencatedProvideAdmin, authencation, createTokenAccessData, extractToken, validateRequestLogin, validateRequestSignIn, verifyJWT
}

