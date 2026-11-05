import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import MetaData from './Layout/MetaData'
import Product from './Product/Product'
import Loader from './Layout/Loader'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

const categoryBannerDetails = {
    consumables: {
        image: '/images/category%20pages/consumables.jpg',
        eyebrow: 'EVERYDAY ESSENTIALS',
        title: 'The details that',
        highlight: 'hold it all together.',
        description: 'Stock up on fasteners, sealants, adhesives, abrasives, and tapes for every job.',
    },
    design: {
        image: '/images/category%20pages/design.jpg',
        eyebrow: 'MAKE IT YOURS',
        title: 'Shape your',
        highlight: 'perfect space.',
        description: 'Bring your vision to life with modern hardware, drafting tools, and finishing details.',
    },
    electrical: {
        image: '/images/category%20pages/electrical.jpg',
        eyebrow: 'POWER EVERY PROJECT',
        title: 'Work smarter with',
        highlight: 'the right tools.',
        description: 'Find dependable electrical tools, testers, wire, outlets, and jobsite essentials.',
    },
    equipment: {
        image: '/images/category%20pages/equipment.jpg',
        eyebrow: 'READY FOR THE JOB',
        title: 'Gear up for',
        highlight: 'the work ahead.',
        description: 'Tackle demanding projects with practical equipment and complete tool sets.',
    },
    materials: {
        image: '/images/category%20pages/materials.jpg',
        eyebrow: 'BUILD WITH CONFIDENCE',
        title: 'Start strong with',
        highlight: 'quality materials.',
        description: 'Discover reliable structural materials, piping, roofing, and masonry supplies.',
    },
    tools: {
        image: '/images/category%20pages/tools.jpg',
        eyebrow: 'TOOLS FOR EVERY TASK',
        title: 'Turn every project into',
        highlight: 'your best work.',
        description: 'Get the hand tools and measuring essentials trusted by builders and makers.',
    },
}

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
    let { keyword, categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const queryCategory = categoryId || searchParams.get('category');
    const selectedCategory = categories.find(
        item => item._id === queryCategory || item.name.toLowerCase() === queryCategory?.toLowerCase()
    )
    const categoryBanner = selectedCategory
        ? categoryBannerDetails[selectedCategory.name.toLowerCase()]
        : null
    const bannerDetails = categoryBanner || {
        image: '/images/download.jpg',
        eyebrow: 'BUILD SOMETHING BOLD',
        title: 'Bring your',
        highlight: 'imagination to life.',
        description: 'Discover bricks, sets and collectibles made for builders who never stop creating.',
    }

    const dispatch = useDispatch();
    const { loading, products, filteredProductsCount } = useSelector(state => state.products);
    const loadMoreRef = useRef(null)
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
        if (queryCategory) {
            if (queryCategory === 'all') {
                setCategory([])
            } else if (categories.length > 0) {
                const matched = categories.find(
                    c => c._id === queryCategory || c.name.toLowerCase() === queryCategory.toLowerCase()
                )
                setCategory(matched ? [matched._id] : [queryCategory])
            } else {
                setCategory([queryCategory])
            }
            setCurrentPage(1)
        }
    }, [queryCategory, categories])

    useEffect(() => {
        dispatch(getProducts(currentPage, keyword, price, category, rating, reviews, currentPage > 1))
    }, [currentPage, keyword, price, category, rating, reviews, dispatch]);

    useEffect(() => {
        const loadMore = entries => {
            if (entries[0].isIntersecting && !loading && products.length < filteredProductsCount) {
                setCurrentPage(page => page + 1)
            }
        }
        const observer = new IntersectionObserver(loadMore, { rootMargin: '300px' })
        if (loadMoreRef.current) observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [filteredProductsCount, loading, products.length])

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
            <MetaData title={'BrickNation'} />
            {loading && currentPage === 1 ? <Loader /> :
                (<div className="storefront">
                    <section className="hero-banner">
                        <div className="hero-copy">
                            <span className="eyebrow">{bannerDetails.eyebrow}</span>
                            <h1>{bannerDetails.title}<br /><strong>{bannerDetails.highlight}</strong></h1>
                            <center>
                                <p>{bannerDetails.description}</p>
                            </center>
                            <a className="hero-cta" href="#products_heading">Shop the collection <span>→</span></a>
                        </div>
                        <div className="hero-art">
                            <span className="sun-shape"></span>
                            <img src={bannerDetails.image} alt={selectedCategory ? `${selectedCategory.name} products` : 'BrickNation collection'} />
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
                            {products.length < filteredProductsCount && (
                                <div ref={loadMoreRef} className="d-flex justify-content-center mt-5" style={{ minHeight: 48 }}>
                                    {loading && <CircularProgress size={32} />}
                                </div>
                            )}
                            {!loading && filteredProductsCount > 0 && products.length >= filteredProductsCount && (
                                <Typography
                                    component="p"
                                    align="center"
                                    color="text.secondary"
                                    sx={{ mt: 5, mb: 2 }}
                                >
                                    You've reached the end of the list
                                </Typography>
                            )}
                        </section>
                    </div>
                </div>)}
        </>

    )
}

export default Home 