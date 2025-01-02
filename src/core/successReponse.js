import {statusCode} from "./httpStatusCode.js";

class SuccessResponse {

    constructor({message, status = statusCode.OK, data = {}, options = {}}) {
        this.message = message;
        this.status = status;
        this.data = data;
        this.options = options;
    }

    send(res, headers = {}) {
        return res.status(this.status)
            .json(this)
    }
}

class Success extends SuccessResponse {
    constructor({message, data = {}, options = {}}) {
        super({message, data, options})
    }
}


class CreatedData extends SuccessResponse {
    constructor({message, data = {}, options = {}}) {
        super({message, status: statusCode.CREATED, data, options})
    }
}


const CREATED_ATTEMP = (res, message, data, options = {}) => {
    new CreatedData({
        message,
        data,
        options
    }).send(res)
}

const REQUEST_CUSTOM = (res, message, data, options = {}) => {
    new Success({
        message,
        data,
        options
    }).send(res)
} 

export {
    CREATED_ATTEMP,
    REQUEST_SUCCESS
}