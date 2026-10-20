import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,
    MY_REVIEW_REQUEST,
    MY_REVIEW_SUCCESS,
    MY_REVIEW_FAIL,
    REVIEW_RESET,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_RESET,
    BULK_DELETE_PRODUCTS_REQUEST,
    BULK_DELETE_PRODUCTS_SUCCESS,
    BULK_DELETE_PRODUCTS_FAIL,
    BULK_ARCHIVE_PRODUCTS_REQUEST,
    BULK_ARCHIVE_PRODUCTS_SUCCESS,
    BULK_ARCHIVE_PRODUCTS_FAIL,
    BULK_UNARCHIVE_PRODUCTS_REQUEST,
    BULK_UNARCHIVE_PRODUCTS_SUCCESS,
    BULK_UNARCHIVE_PRODUCTS_FAIL,
    BULK_PRODUCTS_RESET,
    CLEAR_ERRORS
} from '../constants/productConstants'

export const productsReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case ADMIN_PRODUCTS_REQUEST:
        case ALL_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
                products: []
            }

        case ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.productsCount,
                resPerPage: action.payload.resPerPage,
                filteredProductsCount: action.payload.filteredProductsCount
            }

        case ADMIN_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload

            }

        case ALL_PRODUCTS_FAIL:
        case ADMIN_PRODUCTS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }


        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}

export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {

        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload
            }

        case PRODUCT_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case NEW_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                product: action.payload.product
            }
        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case NEW_PRODUCT_RESET:
            return {
                ...state,
                success: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const productReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_PRODUCT_REQUEST:
        case BULK_DELETE_PRODUCTS_REQUEST:
        case BULK_ARCHIVE_PRODUCTS_REQUEST:
        case BULK_UNARCHIVE_PRODUCTS_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                isUpdated: false,
                isDeleted: false,
                isBulkActionComplete: false
            }

        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload,
                error: null
            }

        case BULK_DELETE_PRODUCTS_SUCCESS:
        case BULK_ARCHIVE_PRODUCTS_SUCCESS:
        case BULK_UNARCHIVE_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                isBulkActionComplete: true,
                affectedCount: action.payload,
                error: null
            }

        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload.success,
                error: null
            }


        case DELETE_PRODUCT_FAIL:
        case BULK_DELETE_PRODUCTS_FAIL:
        case BULK_ARCHIVE_PRODUCTS_FAIL:
        case BULK_UNARCHIVE_PRODUCTS_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isUpdated: false
            }

        case BULK_PRODUCTS_RESET:
            return {
                ...state,
                isBulkActionComplete: false,
                affectedCount: 0
            }

        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case UPDATE_PRODUCT_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            }
        case NEW_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                error: null
            }
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload
            }
        case MY_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case MY_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                canReview: action.payload.canReview,
                review: action.payload.review
            }
        case MY_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case NEW_REVIEW_RESET:
        case REVIEW_RESET:
            return {
                ...state,
                success: false,
                error: null
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }

}