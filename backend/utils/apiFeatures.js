product = require("../models/product");
class APIFeatures {

    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    // http://localhost:2173?keyword=apple&price[]
    // http://localhost:4001/api/v1/products?page=1&keyword=apple&price[lte]=1000&price[gte]=10
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        // console.log(this.query, this.queryStr);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        // { 'price[gte]': '100', 'price[lte]': '1000' }
        const queryCopy = { ...this.queryStr };
        // console.log(queryCopy);
        // Removing fields from the query
        const removeFields = ['keyword', 'page', 'limit']
        removeFields.forEach(el => delete queryCopy[el]);

        let priceFilter = {};
        const priceGte = queryCopy['price[gte]'] || queryCopy.price?.gte;
        const priceLte = queryCopy['price[lte]'] || queryCopy.price?.lte;
        if (priceGte || priceLte) {
            priceFilter.price = {};
            if (priceGte) {
                priceFilter.price.$gte = Number(priceGte);
            }
            if (priceLte) {
                priceFilter.price.$lte = Number(priceLte);
            }
            // priceFilter {
            //     price: {
            //         $gte: 100,
            //         $lte: 1000
            //     }
            // }
            delete queryCopy['price[gte]'];
            delete queryCopy['price[lte]'];
            delete queryCopy.price;
        }

        if (queryCopy.category) {
            queryCopy.category_id = Array.isArray(queryCopy.category)
                ? { $in: queryCopy.category }
                : queryCopy.category;
            delete queryCopy.category;
        }

        const ratingGte = queryCopy['rating[gte]'] || queryCopy.rating?.gte;
        if (ratingGte) {
            queryCopy.ratings = { $gte: Number(ratingGte) };
            delete queryCopy['rating[gte]'];
            delete queryCopy.rating;
        }

        const reviewsGte = queryCopy['numOfReviews[gte]'] || queryCopy.numOfReviews?.gte;
        if (reviewsGte) {
            delete queryCopy['numOfReviews[gte]'];
            delete queryCopy.numOfReviews;
            queryCopy.numOfReviews = { $gte: Number(reviewsGte) };
        }

        delete queryCopy['price[gte]'];
        delete queryCopy['price[lte]'];
        delete queryCopy.isArchived;

        // console.log(queryCopy);

        this.query = this.query.find({ ...priceFilter, ...queryCopy });
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}
module.exports = APIFeatures