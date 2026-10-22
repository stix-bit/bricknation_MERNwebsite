import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MetaData from './Layout/MetaData'
import Product from './Product/Product'
import Loader from './Layout/Loader'
// import Stack from '@mui/material/Stack'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

const Home = () => {
    // const [products, setProducts] = useState([])
    // const [loading, setLoading] = useState(true)
    // const [productsCount, setProductsCount] = useState(0)
    // const [resPerPage, setResPerPage] = useState(0)
    // const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [price, setPrice] = useState([0, 100000]);
    const [priceInput, setPriceInput] = useState([0, 100000]);
    const [priceError, setPriceError] = useState('');
    const [category, setCategory] = useState([]);
    const [rating, setRating] = useState('');
    const [reviews, setReviews] = useState('');
    const [categories, setCategories] = useState([]);
    const [openFilter, setOpenFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    let { keyword } = useParams();

    const dispatch = useDispatch();
    const { loading, products, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products);

    let count = productsCount;
    // console.log(products)
    // const getProducts = async (keyword = '', price, page = 1) => {

    //      let link = `http://localhost:4001/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&page=${page}`

    //     let res = await axios.get(link)
    //     console.log(res.data.products)
    //     setProducts(res.data.products)
    //     setProductsCount(res.data.productsCount)
    //     setFilteredProductsCount(res.data.filteredProductsCount)
    //     setResPerPage(res.data.resPerPage)
    //     setLoading(false)
    // }
    // getProducts()
    // console.log(products)

    if (keyword) {
        count = filteredProductsCount
    }

    const handlePriceChange = (index, value) => {
        const numericValue = value === '' ? '' : Number(value)
        const nextPrice = [...priceInput]
        nextPrice[index] = numericValue
        setPriceInput(nextPrice)
        setPriceError(
            nextPrice[0] !== '' &&
            nextPrice[1] !== '' &&
            nextPrice[0] > nextPrice[1]
                ? 'Minimum price cannot be greater than maximum price.'
                : ''
        )
        setCurrentPage(1);
    }

    const applyPriceFilter = () => {
        if (
            priceInput[0] === '' ||
            priceInput[1] === '' ||
            priceInput[0] < 0 ||
            priceInput[1] < 0 ||
            priceInput[0] > priceInput[1]
        ) {
            setPriceError('Enter a valid price range where minimum is not greater than maximum.')
            return
        }
        setPrice([...priceInput])
        setPriceError('')
        setCurrentPage(1)
    }

    useEffect(() => {
        let isMounted = true
        fetch(`${import.meta.env.VITE_API}/categories`)
            .then(response => {
                if (!response.ok) throw new Error('Unable to load categories')
                return response.json()
            })
            .then(data => {
                if (isMounted) setCategories(data.categories || [])
            })
            .catch(error => console.error(error))
        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        dispatch(getProducts(currentPage, keyword, price, category, rating, reviews))
    }, [currentPage, keyword, price, category, rating, reviews, dispatch]);

    const resetFilters = () => {
        setPrice([0, 100000])
        setPriceInput([0, 100000])
        setPriceError('')
        setCategory([])
        setRating('')
        setReviews('')
        setCurrentPage(1)
    }

    
    return (
        <>
            <MetaData title={'shop Here'} />
            {loading ? <Loader /> :
                (<div className="storefront">
                    <section className="hero-banner">
                        <div className="hero-copy">
                            <span className="eyebrow">BUILD SOMETHING BOLD</span>
                            <h1>Bring your<br /><strong>imagination</strong> to life.</h1>
                            <center>
                            <p>Discover bricks, sets and collectibles made for builders who never stop creating.</p>
                            </center>
                            <a className="hero-cta" href="#products_heading">Shop the collection <span>→</span></a>
                        </div>
                        <div className="hero-art">
                            <span className="sun-shape"></span>
                            <img src="./images/download.jpg" alt="Creative BrickNation character" />
                        </div>
                    </section>
                    <section className="feature-strip">
                        <div><span className="feature-icon">✦</span><strong>Endless creativity</strong><small>Ideas for every builder</small></div>
                        <div><span className="feature-icon">✓</span><strong>Quality guaranteed</strong><small>Made to last and love</small></div>
                        <div><span className="feature-icon">↗</span><strong>Fast delivery</strong><small>Build sooner, smile sooner</small></div>
                    </section>
                    <div className="container-fluid px-4">
                    <div className="section-heading">
                        <div><span className="eyebrow">OUR COLLECTION</span><h2 id="products_heading">Latest products</h2></div>
                        <span className="heading-accent">BRICKNATION / 01</span>
                    </div>
                    <section id="products" className="container-fluid mt-4">
                        {/* <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                            // <Product product={product} />
                        ))}
                    </div> */}

                        <div className="row">
                            {keyword ? (
                                <>
                                <div className="col-12 col-md-3 mt-5 mb-5">
                                    <Paper className="filter-panel" elevation={0} sx={{ p: 3, textAlign: 'left' }}>
                                        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                                            Filters
                                        </Typography>
                                        <div>
                                            <label className="form-label fw-bold">Price Range</label>
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <label htmlFor="minimum_price" className="form-label small">Minimum</label>
                                                    <input
                                                        id="minimum_price"
                                                        type="number"
                                                        className={`form-control ${priceError ? 'is-invalid' : ''}`}
                                                        min="0"
                                                        value={priceInput[0]}
                                                        onChange={(event) => handlePriceChange(0, event.target.value)}
                                                        aria-describedby={priceError ? 'price_filter_error' : undefined}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="maximum_price" className="form-label small">Maximum</label>
                                                    <input
                                                        id="maximum_price"
                                                        type="number"
                                                        className={`form-control ${priceError ? 'is-invalid' : ''}`}
                                                        min="0"
                                                        value={priceInput[1]}
                                                        onChange={(event) => handlePriceChange(1, event.target.value)}
                                                        aria-describedby={priceError ? 'price_filter_error' : undefined}
                                                    />
                                                </div>
                                            </div>
                                            {priceError && (
                                                <div id="price_filter_error" className="invalid-feedback d-block">
                                                    {priceError}
                                                </div>
                                            )}
                                            <Button type="button" variant="contained" fullWidth sx={{ mt: 2 }} onClick={applyPriceFilter}>
                                                Apply price range
                                            </Button>
                                        </div>
                                        <div className="mt-4">
                                            <button type="button" className="btn btn-outline-secondary w-100 text-start" onClick={() => setOpenFilter(openFilter === 'category' ? '' : 'category')}>
                                                Category <span className="float-end">{openFilter === 'category' ? '▲' : '▼'}</span>
                                            </button>
                                            {openFilter === 'category' && (
                                                <div className="border rounded p-2 mt-1 bg-white text-start">
                                                    <label className="d-flex align-items-center py-1">
                                                        <input
                                                            type="checkbox"
                                                            className="flex-shrink-0 me-3"
                                                            style={{ marginRight: '12px' }}
                                                            checked={category.length === 0}
                                                            onChange={() => {
                                                                setCategory([])
                                                                setCurrentPage(1)
                                                            }}
                                                        />
                                                    <span className="flex-grow-1">All categories</span>
                                                    </label>
                                                    {categories.map(item => (
                                                        <label key={item._id} className="d-flex align-items-center py-1">
                                                            <input
                                                                type="checkbox"
                                                                className="flex-shrink-0 me-3"
                                                                style={{ marginRight: '12px' }}
                                                                checked={category.includes(item._id)}
                                                                onChange={() => {
                                                                    setCategory(category.includes(item._id)
                                                                        ? category.filter(categoryId => categoryId !== item._id)
                                                                        : [...category, item._id])
                                                                    setCurrentPage(1)
                                                                }}
                                                            />
                                                            <span className="flex-grow-1">{item.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <button type="button" className="btn btn-outline-secondary w-100 text-start" onClick={() => setOpenFilter(openFilter === 'rating' ? '' : 'rating')}>
                                                Rating <span className="float-end">{openFilter === 'rating' ? '▲' : '▼'}</span>
                                            </button>
                                            {openFilter === 'rating' && (
                                                <div className="border rounded p-2 mt-1 bg-white text-start">
                                                    {[
                                                        ['', 'Any rating'],
                                                        ['5', '5 stars'],
                                                        ['4', '4 stars and up'],
                                                        ['3', '3 stars and up'],
                                                        ['2', '2 stars and up'],
                                                        ['1', '1 star and up']
                                                    ].map(([value, label]) => (
                                                        <label key={label} className="d-flex align-items-center py-1">
                                                            <input
                                                                type="checkbox"
                                                                className="flex-shrink-0 me-3"
                                                                style={{ marginRight: '12px' }}
                                                                checked={rating === value}
                                                                onChange={() => {
                                                                    setRating(rating === value ? '' : value)
                                                                    setCurrentPage(1)
                                                                }}
                                                            />
                                                            <span className="flex-grow-1">{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <button type="button" className="btn btn-outline-secondary w-100 text-start" onClick={() => setOpenFilter(openFilter === 'reviews' ? '' : 'reviews')}>
                                                Number of reviews <span className="float-end">{openFilter === 'reviews' ? '▲' : '▼'}</span>
                                            </button>
                                            {openFilter === 'reviews' && (
                                                <div className="border rounded p-2 mt-1 bg-white text-start">
                                                    {[
                                                        ['', 'Any number of reviews'],
                                                        ['5', '5 reviews and up'],
                                                        ['10', '10 reviews and up'],
                                                        ['25', '25 reviews and up'],
                                                        ['50', '50 reviews and up']
                                                    ].map(([value, label]) => (
                                                        <label key={label} className="d-flex align-items-center py-1">
                                                            <input
                                                                type="checkbox"
                                                                className="flex-shrink-0 me-3"
                                                                style={{ marginRight: '12px' }}
                                                                checked={reviews === value}
                                                                onChange={() => {
                                                                    setReviews(reviews === value ? '' : value)
                                                                    setCurrentPage(1)
                                                                }}
                                                            />
                                                            <span className="flex-grow-1">{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 3 }} onClick={resetFilters}>
                                            Clear filters
                                        </Button>
                                    </Paper>
                                </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products.map(product => (
                                                <Product key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                products.map(product => (
                                    <Product key={product._id} product={product} />
                                ))
                            )}

                        </div>
                        {resPerPage < count && (
                            <div className="d-flex justify-content-center mt-5">
                                <Stack spacing={2}>
                                    <Pagination
                                        count={Math.ceil(count / resPerPage)}
                                        page={currentPage}
                                        onChange={(event, value) => setCurrentPage(value)}

                                        color="primary"
                                        variant="outlined"
                                        shape="rounded"
                                        showFirstButton
                                        showLastButton
                                        size="large"
                                        sx={{
                                            backgroundColor: 'white',

                                        }}
                                    />
                                </Stack>
                            </div>
                        )}
                    </section>
                    </div>
                </div>)}
        </>

    )
}

export default Home 