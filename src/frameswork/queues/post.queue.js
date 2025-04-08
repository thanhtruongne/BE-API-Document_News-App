import { BaseQueue } from "./base.queue.";




class PostServiceQueue extends BaseQueue {
    constructor() {
        super('posts')
    }
}




export const postQueue = new PostServiceQueue()