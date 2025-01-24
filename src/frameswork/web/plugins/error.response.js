import {reasonPhrases,statusCode} from "./httpStatusCode.js"

class BaseError extends Error {
    constructor(message, status, errors, isOperational) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.status = status
        this.errors = errors
        this.isOperational = isOperational
        Error.captureStackTrace(this, this.constructor)
    }
}

class Api409Error extends BaseError {
    constructor(message = reasonPhrases.CONFLICT, errors = [], status = statusCode.CONFLICT, isOperational = true) {
        super(message, status, errors, isOperational);
    }
}

class Api403Error extends BaseError {
    constructor(message = reasonPhrases.FORBIDDEN, errors = [], status = statusCode.FORBIDDEN, isOperational = true) {
        super(message, status, errors, isOperational);
    }
}

class Api401Error extends BaseError {
    constructor(message = reasonPhrases.UNAUTHORIZED, errors = [], status = statusCode.UNAUTHORIZED, isOperational = true) {
        super(message, status, errors, isOperational);
    }
}

class BusinessLogicError extends BaseError {
    constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, errors = [], status = statusCode.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message, status, errors, isOperational);
    }
}

class Api404Error extends BaseError {
    constructor(message = reasonPhrases.NOT_FOUND, errors = [], status = statusCode.NOT_FOUND, isOperational = true) {
        super(message, status, errors, isOperational);
    }
}


export {
    Api401Error,
    Api403Error,
    Api404Error,
    Api409Error,
    BusinessLogicError,
    BaseError,
}