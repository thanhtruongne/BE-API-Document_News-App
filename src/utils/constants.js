const CacheDynamic = {
    USER_ALL_DATA: 'users_all_data',
    DATA_TREE_FORM_CATE: "categories_tree_data",
    CATEGORIES_DATA_NAVBAR: "categories_navbar_data",
    POST_ALL_DATA: 'postBlog_all_data',
    POST_SEARCHING_DATA_FORM: "Searching_Data",
    POST_DATA_NEW_NOTIFY: "client_post_data_notify_new",
    POST_DATA_CONTENT_PAGE_SIDE: "client_post_data_content_side",
    POST_COMMENT_QUERY: "client_comment_query"
}

const CacheKeyVal = {
    CHECK_VIEW_POST_USER: 'check_view_cache_user',
    VIEW_USER_OWNID: 'view_onwner_user_id',
}



const constantModel = {
    POSTS: "Posts",
    CATEGORIES: "Categories",
    FEED: 'Feed',
    TOPIC: 'Topic'
}   

const USER_INFO_CHANGE = {
    AVATAR: 'avatar',
    FULL_NAME: 'full_name',
    EMAIL_CHANGE: 'email',
    CHANGE_PASSWORD: 'password',
}


const NOTIFY_CONSTANST = {
    SUBJECT_COMMENT: 'Thông báo bình luận',
}


export default {
    ...CacheDynamic,
    ...constantModel,
    ...USER_INFO_CHANGE,
    ...NOTIFY_CONSTANST,
    ...CacheKeyVal
}