import { postWorker } from "../workers/posts.worker.js";
import { BaseQueue } from "./base.queue.js";




class PostServiceQueue extends BaseQueue {
    constructor() {
        super('posts')
        
        //khai báo các service queue và worker
        this.processJob('addPostLike', 4, postWorker.handlePostLike)
    }



    addPostLike(name,data) {
        this.addJob(name,data)
    }
}




export const postQueue = new PostServiceQueue()