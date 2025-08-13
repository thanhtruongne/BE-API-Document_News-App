import mongoose, { Schema } from "mongoose";
import i18n from "../../../../config/i18n/i18n.config.js";
import { convertStringSlug } from "../../../../utils/index.utils.js";
import { Api403Error } from "../../../web/plugins/error.response.js";

const Categories = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        uniqe: true,
        lowercase: true
    },
    description: {
        type: String,
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Block', 'Active'],
        default: 'Active'
    },
    parent_id: { type: Schema.Types.ObjectId, ref: 'categories', default: null },
}, {
    timestamps: true
})


Categories.pre('save', async function (next) {
    const check_exist_slug = await mongoose.model('Categories')
        .findOne({ slug: this.slug })
        .select('slug')
        .lean()
        .exec()
    if (check_exist_slug)
        return next(new Api403Error(i18n.translate('error.categories.slug_unique')))

    this.slug = convertStringSlug(this.title);

    if (this.parent_id != null) {
        let find_parent = await mongoose.model('Categories')
            .findOne({ _id: this.parent_id })
            .select('slug')
            .lean()
            .exec()

        this.slug = '/' + find_parent.slug + '/' + this.slug
    }


    next();

})


export default mongoose.model('Categories', Categories);


