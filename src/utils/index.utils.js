import _ from 'lodash';
import { Types } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';




const getSelectData = (fields = [], obj = {}) => {
  return _.pick(obj, fields);
}

const checkEnable = (value) => {
  return value === 'true'
}

const isValidEmail = (email) => {
  return validator.isEmail(email);
}

const checkEmptyVal = (field) => {
  if (!field)
    return true
  return validator.isEmpty(field);
}

//pass có viết hoa, thường, số, ký tự đặc biệt ít nhất 8 ký tự
const checkPasswordValid = (password) => {
  const preg_match = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return preg_match?.test(password);
}

const checkValidatePhone = (phone) => {
  const regex = /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])\d{7}$/;
  return validator.isMobilePhone(phone, 'vi-VN') && regex.test(phone);
}


const convertToObject = id => {
  return new Types.ObjectId(id)
}

const convertStringSlug = (string) => {
  return slugify(string, { lower: true, strict: true });
}

const omit = (obj, ...props) => {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}


const convertObjectParams = (query) => {
  const params = {};
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      params[key] = query[key];
    }
  }
  params.page = params.page ? parseInt(params.page, 10) : 1;
  params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
  return params;
}

const getValuesFromTree = (nodes, number = null) => {
  let result = [];
  let resultName = [];
  let slug = [];
  let object_value = [];
  let object_value_name = []
  nodes.forEach((node, index) => {
    if (number && index > number) {
      return result
    }
    if (node.slug && node.slug.includes('goc-nhin')) {
      object_value_name = [node.slug]
    }

    let values = [node.value];
    let name_value = [node.title];
    let slug_name = [node.slug];
    if (node.children && node.children.length > 0) {
      const childValues = getValuesFromTree(node.children, number);
      values = values.concat(childValues.result.flat());
      name_value = name_value.concat(childValues.name.flat());
      slug_name = slug_name.concat(childValues.slug.flat());
    }

    result.push(values.flat());
    slug.push(slug_name.flat())
    resultName.push(name_value.flat())
  });
  return {
    result,
    slug,
    name: resultName
  }
};


const formatDateViWithTimezone = (isoString) => {
  // Tạo date object
  const date = new Date(isoString);


  const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));

  const weekdays = [
    'Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư',
    'Thứ năm', 'Thứ sáu', 'Thứ bảy'
  ];

  const day = vietnamTime.getUTCDate();
  const month = vietnamTime.getUTCMonth() + 1;
  const year = vietnamTime.getUTCFullYear();
  const hours = vietnamTime.getUTCHours().toString().padStart(2, '0');
  const minutes = vietnamTime.getUTCMinutes().toString().padStart(2, '0');
  const weekday = weekdays[vietnamTime.getUTCDay()];

  return `${weekday}, ${day}/${month}/${year}, ${hours}:${minutes}`;
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
}


function buildCommentTree(comments) {
  const commentMap = {};
  const tree = [];
  let countData = 0;

  function addToMap(comment) {
    const commentId = comment._id.toString();
    if (!commentMap[commentId]) {
      commentMap[commentId] = { ...comment, children: [] };
      countData++; // Tăng countData cho mỗi comment duy nhất
    }
  }

  comments.forEach(comment => {
    addToMap(comment);
    if (comment.children && comment.children.length > 0) {
      comment.children.forEach(child => addToMap(child));
    }
  });

  Object.values(commentMap).forEach(comment => {
    const parentId = comment.parent_id ? comment.parent_id.toString() : null;
    if (parentId && commentMap[parentId]) {
      if (!commentMap[parentId].children.some(c => c._id.toString() === comment._id.toString())) {
        commentMap[parentId].children.push(comment);
      }
    } else if (!parentId) {
      if (!tree.some(c => c._id.toString() === comment._id.toString())) {
        tree.push(comment);
      }
    }
  });

  function cleanAndSortComment(comment) {
    const cleanComment = { ...comment };
    delete cleanComment.depth;
    if (cleanComment.children && cleanComment.children.length > 0) {
      cleanComment.children = cleanComment.children
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(child => cleanAndSortComment(child)); // Không tăng countData ở đây
    }
    return cleanComment;
  }

  return {
    data: tree
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(comment => cleanAndSortComment(comment)),
    countData
  };
}


function handleCheckLike(response, userID = null) {
  return response.map(item => {
    item.isLike = item.user_likes.length > 0 && item.user_likes.includes(userID) ? true : false;
  })
}

function convertSortToQueryString(sort, params = {}) {
  const queryParts = [];

  if (sort) {
    for (const [field, direction] of Object.entries(sort)) {
      const normalizedDirection = direction === 1 || direction === '1' ? '1' : '-1';

      const normalizedField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
      queryParts.push(`${normalizedField}=${normalizedDirection}`);
    }
  }

  for (const [key, value] of Object.entries(params)) {
    queryParts.push(`${key}=${encodeURIComponent(value)}`);
  }

  return queryParts.join('&');
}

export {
  buildCommentTree,
  checkEmptyVal,
  checkEnable,
  checkPasswordValid, checkValidatePhone,
  convertObjectParams, convertSortToQueryString, convertStringSlug,
  convertToObject,
  formatDateViWithTimezone,
  getSelectData,
  getValuesFromTree, handleCheckLike, isValidEmail,
  omit, timeSince
};

