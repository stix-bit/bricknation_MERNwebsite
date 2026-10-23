import axios from 'axios';
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    MY_REVIEW_REQUEST,
    MY_REVIEW_SUCCESS,
    MY_REVIEW_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    BULK_DELETE_PRODUCTS_REQUEST,
    BULK_DELETE_PRODUCTS_SUCCESS,
    BULK_DELETE_PRODUCTS_FAIL,
    BULK_ARCHIVE_PRODUCTS_REQUEST,
    BULK_ARCHIVE_PRODUCTS_SUCCESS,
    BULK_ARCHIVE_PRODUCTS_FAIL,
    BULK_UNARCHIVE_PRODUCTS_REQUEST,
    BULK_UNARCHIVE_PRODUCTS_SUCCESS,
    BULK_UNARCHIVE_PRODUCTS_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

export const getProducts = (
    currentPage = 1,
    keyword = '',
    price = [0, 100000],
    category = '',
    rating = '',
    reviews = '',
    append = false
) => async (dispatch) => {
    try {
        dispatch({
            type: ALL_PRODUCTS_REQUEST,
            append
        })

        const params = new URLSearchParams({
            page: currentPage.toString(),
            keyword,
            'price[lte]': price[1].toString(),
            'price[gte]': price[0].toString()
        })
        if (Array.isArray(category)) {
            category.forEach(categoryId => params.append('category', categoryId))
        } else if (category) {
            params.set('category', category)
        }
        if (rating) params.set('rating[gte]', rating.toString())
        if (reviews) params.set('numOfReviews[gte]', reviews.toString())
        const link = `${import.meta.env.VITE_API}/products?${params.toString()}`
        const { data } = await axios.get(link)
        console.log(data)
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data,
            meta: { append }
        })

    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true //correct
        }
        const { data } = await axios.post(`${import.meta.env.VITE_API}/admin/product/new`, productData, config)
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, {
            //AxiosRequestConfig parameter
            withCredentials: true //correct
        })
        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products
        })
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST })
        const config = {
            withCredentials: true //correct
        }
        const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config)
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to update product'
        })
    }
}

export const deleteProduct = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_PRODUCT_REQUEST })

        const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/product/${id}`, {
            withCredentials: true
        })

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to delete product'
        })
    }
}

export const bulkDeleteProducts = (ids) => async (dispatch) => {
    try {
        dispatch({ type: BULK_DELETE_PRODUCTS_REQUEST })
        const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/products/bulk`, {
            data: { ids },
            withCredentials: true
        })
        dispatch({ type: BULK_DELETE_PRODUCTS_SUCCESS, payload: data.deletedCount })
    } catch (error) {
        dispatch({
            type: BULK_DELETE_PRODUCTS_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to delete products'
        })
    }
}

export const bulkArchiveProducts = (ids) => async (dispatch) => {
    try {
        dispatch({ type: BULK_ARCHIVE_PRODUCTS_REQUEST })
        const { data } = await axios.patch(`${import.meta.env.VITE_API}/admin/products/bulk/archive`, { ids }, {
            withCredentials: true
        })
        dispatch({ type: BULK_ARCHIVE_PRODUCTS_SUCCESS, payload: data.archivedCount })
    } catch (error) {
        dispatch({
            type: BULK_ARCHIVE_PRODUCTS_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to archive products'
        })
    }
}

export const bulkUnarchiveProducts = (ids) => async (dispatch) => {
    try {
        dispatch({ type: BULK_UNARCHIVE_PRODUCTS_REQUEST })
        const { data } = await axios.patch(`${import.meta.env.VITE_API}/admin/products/bulk/unarchive`, { ids }, {
            withCredentials: true
        })
        dispatch({ type: BULK_UNARCHIVE_PRODUCTS_SUCCESS, payload: data.unarchivedCount })
    } catch (error) {
        dispatch({
            type: BULK_UNARCHIVE_PRODUCTS_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to unarchive products'
        })
    }
}

export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST })
        const { data } = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data
        })
        return true
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to save review'
        })
        return false
    }
}

export const getMyProductReview = (productId) => async (dispatch) => {
    try {
        dispatch({ type: MY_REVIEW_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/review?productId=${productId}`, {
            withCredentials: true
        })
        dispatch({ type: MY_REVIEW_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: MY_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to load review status'
        })
    }
}

export const getProductReviews = (productId) => async (dispatch) => {
    try {
        dispatch({ type: GET_REVIEWS_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/reviews?id=${encodeURIComponent(productId)}`, {
            withCredentials: true
        })
        dispatch({ type: GET_REVIEWS_SUCCESS, payload: data.reviews })
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to load reviews'
        })
    }
}

export const deleteReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST })
        await axios.delete(
            `${import.meta.env.VITE_API}/reviews?id=${encodeURIComponent(reviewId)}&productId=${encodeURIComponent(productId)}`,
            { withCredentials: true }
        )
        dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId })
        return true
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message || 'Unable to delete review'
        })
        return false
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}