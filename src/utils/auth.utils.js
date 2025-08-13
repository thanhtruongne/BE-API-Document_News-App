import crypto from "crypto"
import JWT from "jsonwebtoken"
import userRepositoriesApp from "../application/repositories/userRepositories.app.js"
import i18n from "../config/i18n/i18n.config.js"
import userRepositoryDB from "../frameswork/databases/mongoDB/repositories/userRepositoriesDB.js"
import { Api401Error, Api403Error, Api404Error, BusinessLogicError } from "../frameswork/web/plugins/error.response.js"
import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc.js"
import { checkEmptyVal, checkPasswordValid, checkValidatePhone, isValidEmail } from './index.utils.js'


const HEADER = {
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refreshtoken',
    X_CLIENT_ID: 'x-client-id',
    BEARER: 'Bearer'
}

const ADMIN_FEATURE = {
    ADMIN: 'Admin'
}


export const createTokenAccessData = async (payload, publicKey, privateKey) => {
    try {
        const access_token = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2d'
        })

        const refresh_token = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        })

        JWT.verify(access_token, publicKey, (err, decoded) => {
            if (err) {
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
export const extractToken = (tokenHeader) => {
    if (!tokenHeader || checkEmptyVal(tokenHeader)) return "";
    return tokenHeader.split(' ')[1]
}

const convertPublicKeyObecjt = (publicKey) => {
    return crypto.createPublicKey(publicKey);
}

export const verifyJWT = (token, keySecret, next) => {
    try {

        return JWT.verify(token, keySecret, { algorithms: 'RS256' });
    } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
            return next(new Api401Error(i18n.translate("error.token_expried")))
        } else if (error instanceof JWT.JsonWebTokenError) {
            return next(new Api403Error(i18n.translate("error.refreshToken.invalid")))
        } else {
            return next(new BusinessLogicError(i18n.translate("error.invalid.request")))
        }

    }

}

// const parseJWT = (token) => JSON.parse(Buffer?.from(token?.split('.')[1], 'base64').toString());
export const parseJWT = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token provided');
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64');
        return JSON.parse(jsonPayload.toString());
    } catch (error) {
        console.error('JWT Parse Error:', error.message);
        return null;
    }
};


export const authencation = catchingAsyncAwait(async (req, res, next) => {
    const userRepo = userRepositoriesApp(userRepositoryDB())
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    const accessToken = req.headers[HEADER.AUTHORIZATION]


    if ((accessToken == 'undefined' || clientId == 'undefined')) {
        return next(new Api403Error(i18n.translate('error.not_found.data')))
    }
    const parseTokens = (accessToken === 'undefined' || accessToken == null) ? refreshToken : accessToken

    const obj = parseJWT(parseTokens)
    if (!obj?.userID) return next(new Api401Error(i18n.translate('error.not_found.data')))

    const userId = clientId || obj.userID;
    if (!userId) return next(new Api403Error(i18n.translate('error.not_found.data')))

    const store = await userRepo.findUserKeyTokenID(userId)
    if (!store) return next(new Api404Error(i18n.translate('error.user_id.not_found')))

    if (refreshToken) {
        try {
            const decodeUser = verifyJWT(refreshToken, store.publicKey, next);
            if (!decodeUser)
                return next(new Api401Error(i18n.translate('error.user_id.not_found')))
            if (userId !== decodeUser.userID) return next(new Api401Error(i18n.translate('error.user_id.not_found')))

            req.user = decodeUser
            req.store = store
            req.refreshToken = refreshToken

            return next()
        } catch (error) {
            return next(error)
        }
    }

    if (!accessToken) return next(new Api403Error(i18n.translate('error.invalid.request')))
    try {
        const decode = verifyJWT(accessToken, store.publicKey, next);
        if (userId !== decode?.userID)
            return next(new Api401Error(i18n.translate('error.user_id.not_found')))

        req.user = decode
        req.store = store
        return next()
    } catch (error) {
        return next(error)
    }
})


export const optionalAuth = catchingAsyncAwait(async (req, res, next) => {
    const userRepo = userRepositoriesApp(userRepositoryDB());
    const clientId = req.headers[HEADER.X_CLIENT_ID];
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]

    
    if (!accessToken || accessToken === 'undefined') {
        return next();
    }

    try {
        const obj = parseJWT(accessToken);
        if (!obj?.userID) {
            return next();
        }

        const userId = clientId || obj.userID;
        if (!userId) {
            return next();
        }

        const store = await userRepo.findUserKeyTokenID(userId);
        if (!store) {
            return next();
        }

        const user = await userRepo.findByID(userId);
        if (!user) {
            return next();
        }

        if (refreshToken) {
            const decodeUser = verifyJWT(refreshToken, store.publicKey, next);
            if (!decodeUser)
                return next()
            if (userId !== decodeUser.userID) return next()

            req.user = decodeUser
            req.refreshToken = refreshToken

            return next()
        }

        const decode = verifyJWT(accessToken, store.publicKey, next);
        if (userId !== decode?.userID)
            return next()

        req.user = decode
        return next()
    } catch (error) {
        logger.error(`Error in optionalAuth middleware for user ${userId}:`, error);
        return next();
    }
});

export const AuthencatedProvideAdmin = catchingAsyncAwait(async (req, res, next) => {
    const userRepo = userRepositoriesApp(userRepositoryDB())
    const _id = req.user?.userID

    if (!_id) {
        return next(new Api401Error(i18n.translate('error.user_id.not_found')))
    }
    const users = await userRepo.findByQuery({
        _id, status: 'Active'
    }, {
        role: 1
    })
    if (users?.role == ADMIN_FEATURE.ADMIN) {
        return next();
    } else {
        return next(new Api404Error(i18n.translate('error.user_id.not_found')))
    }

})


export const validateRequestSignIn = (payload) => {
    if (checkEmptyVal(payload?.email) || checkEmptyVal(payload?.phone) || checkEmptyVal(payload?.full_name) || checkEmptyVal(payload?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
    }
    if (!isValidEmail(payload?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
    }
    if (!checkPasswordValid(payload?.password)) {
        throw new Api403Error(i18n.translate('error.Invalid.password'));
    }
    if (!checkValidatePhone(payload?.phone)) {
        throw new Api403Error(i18n.translate('error.Invalid.phone'));
    }
    return true;
}

export const validateRequestLogin = (payload) => {
    if (checkEmptyVal(payload?.email) || checkEmptyVal(payload?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
    }
    if (!isValidEmail(payload?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
    }

    return true;
}