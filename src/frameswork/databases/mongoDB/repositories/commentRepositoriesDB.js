import mongoose from "mongoose"
import { omit } from "../../../../utils/index.utils.js"
import comment from "../models/comment.js"



const commentRepositoriesDB = () => {

    const storeResource = async (payload) => {
        return await comment.create({
            postId: payload.getPostID(),
            content: payload.getContent(),
            full_name: payload.getFullName(),
            parent_id: payload.getParentID(),
            userId: payload.getUserID(),
        })
    }

    const findByIDAndUpdatePayload = async (_id, payload) => await comment.findByIdAndUpdate(_id, payload, { new: true, runValidators: true }).lean().exec()

    const updateResource = async (_id, payload) => {
        return await comment.findByIdAndUpdate(_id, payload, {
            new: true
        })
    }

    const updateStatusResource = async (_id, payload) => {
        return await comment.findByIdAndUpdate(_id, {
            status: payload.getStatus()
        }, {
            new: true
        })
    }

    const removeResource = async (_id) => {
        return await comment.findByIdAndDelete(_id).exec();
    }

    const findByID = async (_id, select = '', isLean = true) => {
        return await comment.findById(_id).select(select).lean(isLean).exec()
    }

    const findByQuery = async (params) => {
        return await comment.find(omit(params, 'limit', 'perPage', 'page', 'select', 'sort'))
            .skip(params.perPage * params.page - params.perPage)
            .limit(params?.perPage || 4)
            .sort(params.sort || { createdAt: 1 })
            .lean()
            .exec()
    }


    const getAllChildComment = async (id) => {
        try {
            const result = await comment.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(id) }
                },
                {
                    $graphLookup: {
                        from: 'comments',
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'parentId',
                        as: 'children',
                        depthField: 'depth'
                    }
                },
                {
                    $addFields: {
                        children: {
                            $filter: {
                                input: '$children',
                                as: 'child',
                                cond: { $eq: ['$$child.status', 'active'] }
                            }
                        }
                    }
                },
                {
                    $unwind: { path: '$children', preserveNullAndEmptyArrays: true }
                },
                {
                    $sort: { 'children.createdAt': 1 }
                },
                {
                    $group: {
                        _id: '$_id',
                        content: { $first: '$content' },
                        author: { $first: '$author' },
                        children: { $push: '$children' }
                    }
                }
            ]);

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    const getParentAndChildComment = async (id, params) => {
        try {
            const skip = (params.page - 1) * params.limit;

            const result = await comment.aggregate([
                {
                    $match: {
                        postId: new mongoose.Types.ObjectId(id),
                        parent_id: null,
                        status: 'Active'
                    }
                },

                {
                    $graphLookup: {
                        from: 'Comment',
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'parent_id',
                        as: 'children',
                        restrictSearchWithMatch: {
                            status: 'Active'
                        },
                        maxDepth: 100,
                        depthField: 'depth'
                    }
                },
                {
                    $addFields: {
                        replyCount: { $size: '$children' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        status: 1,
                        full_name: 1,
                        parent_id: 1,
                        level: 1,
                        like: 1,
                        replyCount: 1,
                        user_likes: 1,
                        createdAt: 1,
                        author: 1,
                        children: {
                            $map: {
                                input: '$children',
                                as: 'child',
                                in: {
                                    _id: '$$child._id',
                                    content: '$$child.content',
                                    status: '$$child.status',
                                    parent_id: '$$child.parent_id',
                                    level: '$$child.level',
                                    createdAt: '$$child.createdAt',
                                    user_likes: '$$child.user_likes',
                                    like: '$$child.like',
                                    author: '$$child.author',
                                    depth: '$$child.depth',
                                    replyCount: {
                                        $size: {
                                            $filter: {
                                                input: '$children',
                                                as: 'subChild',
                                                cond: { $eq: ['$$subChild.parent_id', '$$child._id'] }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: params.sort || { createdAt: 1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: params.limit || 20
                }
            ]);
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    const getDataCommentByID = async (id, params) => {
        try {
            const result = await comment.aggregate([
                {
                    $match: {
                        parent_id: new mongoose.Types.ObjectId(id),
                        status: 'Active'
                    }
                },
                {
                    $lookup: {
                        from: 'Comment',
                        let: { parentId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$parent_id', '$$parentId'] },
                                            { $eq: ['$status', 'Active'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $sort: params.sort || { createdAt: 1 }
                            },
                            {
                                $limit: 6
                            }
                        ],
                        as: 'children'
                    }
                },
                {
                    $addFields: {
                        replyCount: { $size: '$children' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        status: 1,
                        full_name: 1,
                        parent_id: 1,
                        level: 1,
                        replyCount: 1,
                        createdAt: 1,
                        author: 1,
                        children: {
                            $map: {
                                input: '$children',
                                as: 'child',
                                in: {
                                    _id: '$$child._id',
                                    content: '$$child.content',
                                    status: '$$child.status',
                                    parent_id: '$$child.parent_id',
                                    level: '$$child.level',
                                    createdAt: '$$child.createdAt',
                                    author: '$$child.author',
                                    depth: '$$child.depth',
                                    replyCount: {
                                        $size: {
                                            $filter: {
                                                input: '$children',
                                                as: 'subChild',
                                                cond: { $eq: ['$$subChild.parent_id', '$$child._id'] }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: params.sort || { createdAt: 1 }
                }
            ]);

            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }


    const checkExistsQuery = async (query) => {
        return await comment.exists(query);
    }

    const countDocumentQuery = async (query) => await comment.countDocuments(query);



    return {
        storeResource,
        updateResource,
        removeResource,
        updateStatusResource,
        findByID,
        findByQuery,
        findByIDAndUpdatePayload,
        checkExistsQuery,
        getAllChildComment,
        getParentAndChildComment,
        getDataCommentByID,
        countDocumentQuery
    }
}



export default commentRepositoriesDB