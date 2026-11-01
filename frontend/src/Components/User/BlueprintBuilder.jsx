import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import { addItemToCart } from '../../actions/cartActions'
import { formatPeso } from '../../Utils/helpers'

const materialKeywords = ['wood', 'wire', 'circuit', 'cement', 'pipe', 'plywood', 'rebar', 'roof', 'brick', 'paint', 'adhesive']

const BlueprintBuilder = () => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector(state => state.auth)
    const fileInputRef = useRef(null)
    const [activeTab, setActiveTab] = useState(0)
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState('')
    const [blueprint, setBlueprint] = useState(null)
    const [blueprintName, setBlueprintName] = useState('')
    const [placedItems, setPlacedItems] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API}/products?limit=100`)
                setProducts(data.products || [])
            } catch (requestError) {
                setError(requestError.response?.data?.message || 'Unable to load store materials.')
            } finally {
                setLoadingProducts(false)
            }
        }

        loadProducts()
    }, [])

    const suggestedProducts = useMemo(() => {
        const matching = products.filter(product =>
            materialKeywords.some(keyword => product.name.toLowerCase().includes(keyword))
        )
        return matching.length ? matching.slice(0, 12) : products.slice(0, 12)
    }, [products])

    const handleBlueprintUpload = event => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please upload a floor plan image.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setBlueprint(reader.result)
            setBlueprintName(file.name)
            setError('')
        }
        reader.onerror = () => setError('Unable to read the selected blueprint.')
        reader.readAsDataURL(file)
    }

    const addToBuilder = product => {
        setPlacedItems(current => {
            const existing = current.find(item => item.product._id === product._id)
            if (existing) {
                return current.map(item => item.product._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item)
            }
            return [...current, { product, quantity: 1, x: 18 + (current.length * 22) % 70, y: 18 + (current.length * 17) % 65 }]
        })
    }

    const moveBuilderItem = (id, event) => {
        const bounds = event.currentTarget.parentElement.getBoundingClientRect()
        const x = Math.max(2, Math.min(88, ((event.clientX - bounds.left) / bounds.width) * 100))
        const y = Math.max(2, Math.min(84, ((event.clientY - bounds.top) / bounds.height) * 100))
        setPlacedItems(current => current.map(item => item.product._id === id ? { ...item, x, y } : item))
    }

    const updateQuantity = (id, amount) => {
        setPlacedItems(current => current
            .map(item => item.product._id === id ? { ...item, quantity: item.quantity + amount } : item)
            .filter(item => item.quantity > 0))
    }

    const addAllToCart = async () => {
        for (const item of placedItems) {
            await dispatch(addItemToCart(item.product._id, item.quantity))
        }
    }

    const addProductToCart = product => {
        dispatch(addItemToCart(product._id, 1))
    }

    const saveBlueprint = async () => {
        if (!blueprint || !isAuthenticated) return
        setSaving(true)
        try {
            await axios.post(`${import.meta.env.VITE_API}/blueprint`, {
                image_url: blueprint,
                extracted_materials: placedItems.map(item => item.product._id)
            }, { withCredentials: true })
            setError('')
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to save this blueprint.')
        } finally {
            setSaving(false)
        }
    }

    const total = placedItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

    return (
        <>
            <MetaData title="Blueprint Builder" />
            <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: 4, boxSizing: 'border-box' }}>
                <Box sx={{ mb: 3, textAlign: 'left' }}>
                    <Typography variant="h4" fontWeight={700}>Blueprint Material Planner</Typography>
                    <Typography color="text.secondary">
                        Upload a floor plan, identify materials, and plan your project materials visually.
                    </Typography>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ px: 2 }}>
                        <Tab label="Blueprint Reader" />
                        <Tab label="Material Builder" />
                    </Tabs>
                    <Divider />
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        {activeTab === 0 ? (
                            <Stack spacing={3}>
                                <Box
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: 'primary.main',
                                        borderRadius: 2,
                                        p: 4,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        bgcolor: 'action.hover'
                                    }}
                                >
                                    <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleBlueprintUpload} />
                                    <Typography variant="h6">Upload a standard floor plan</Typography>
                                    <Typography color="text.secondary">PNG, JPG, or JPEG</Typography>
                                    <Button variant="contained" sx={{ mt: 2 }}>Choose Blueprint</Button>
                                </Box>
                                {blueprint && (
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.2fr) minmax(0, 1fr)' }, gap: 3, minWidth: 0 }}>
                                        <Box component="img" src={blueprint} alt={blueprintName} sx={{ display: 'block', width: '100%', maxHeight: 520, minWidth: 0, objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: 2 }} />
                                        <Stack spacing={2} sx={{ minWidth: 0, textAlign: 'left' }}>
                                            <Typography variant="h6">Detected material matches</Typography>
                                            <Typography color="text.secondary">
                                                Select materials from the store inventory to add them to your visual build.
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, maxHeight: 190, overflowY: 'auto', alignContent: 'flex-start' }}>
                                                {suggestedProducts.map(product => (
                                                    <Stack key={product._id} direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                                        <Chip
                                                            label={product.name}
                                                            onClick={() => addToBuilder(product)}
                                                            clickable
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}
                                                        />
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => addProductToCart(product)}
                                                            sx={{ flexShrink: 0, textTransform: 'none', whiteSpace: 'nowrap' }}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </Stack>
                                                ))}
                                            </Box>
                                            <Button fullWidth variant="outlined" onClick={() => setActiveTab(1)}>Open Material Builder</Button>
                                        </Stack>
                                    </Box>
                                )}
                            </Stack>
                        ) : (
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(220px, 280px) minmax(0, 1fr) minmax(220px, 280px)' }, gap: 3, minWidth: 0 }}>
                                <Stack spacing={1.5} sx={{ minWidth: 0, textAlign: 'left' }}>
                                    <Typography variant="h6">Inventory</Typography>
                                    {loadingProducts ? <CircularProgress size={24} /> : suggestedProducts.map(product => (
                                        <Button
                                            key={product._id}
                                            variant="outlined"
                                            draggable
                                            onDragStart={event => event.dataTransfer.setData('productId', product._id)}
                                            onClick={() => addToBuilder(product)}
                                            sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                                        >
                                            {product.name}
                                        </Button>
                                    ))}
                                </Stack>
                                <Box
                                    onDragOver={event => event.preventDefault()}
                                    onDrop={event => {
                                        const id = event.dataTransfer.getData('productId')
                                        const product = products.find(item => item._id === id)
                                        if (product) addToBuilder(product)
                                    }}
                                    sx={{
                                        position: 'relative',
                                        minHeight: 520,
                                        border: '2px dashed',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        background: blueprint ? `url(${blueprint}) center / contain no-repeat` : 'linear-gradient(135deg, #f8f5ed 25%, #fff 25%, #fff 50%, #f8f5ed 50%, #f8f5ed 75%, #fff 75%)',
                                        backgroundSize: blueprint ? 'contain' : '32px 32px'
                                    }}
                                >
                                    <Typography sx={{ p: 2, color: 'text.secondary' }}>Drag materials here or click an inventory item</Typography>
                                    {placedItems.map(item => (
                                        <Box
                                            key={item.product._id}
                                            draggable
                                            onDragEnd={event => moveBuilderItem(item.product._id, event)}
                                            sx={{ position: 'absolute', left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 1, borderRadius: 2, cursor: 'grab', maxWidth: 160, boxShadow: 2 }}
                                        >
                                            <Typography variant="caption" fontWeight={700}>{item.product.name}</Typography>
                                            <Typography variant="caption" display="block">x{item.quantity}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Stack spacing={2} sx={{ minWidth: 0, textAlign: 'left' }}>
                                    <Typography variant="h6">Shopping List</Typography>
                                    {placedItems.length === 0 && <Typography color="text.secondary">No materials selected.</Typography>}
                                    {placedItems.map(item => (
                                        <Box key={item.product._id}>
                                            <Typography variant="body2" fontWeight={600}>{item.product.name}</Typography>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography color="text.secondary">₱{formatPeso(item.product.price)} x {item.quantity}</Typography>
                                                <Stack direction="row">
                                                    <Button size="small" onClick={() => updateQuantity(item.product._id, -1)}>-</Button>
                                                    <Button size="small" onClick={() => updateQuantity(item.product._id, 1)}>+</Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    ))}
                                    <Divider />
                                    <Typography variant="h6">Total: ₱{formatPeso(total)}</Typography>
                                    <Button variant="contained" disabled={!placedItems.length} onClick={addAllToCart}>Add All to Cart</Button>
                                    <Button variant="outlined" disabled={!blueprint || !isAuthenticated || saving} onClick={saveBlueprint}>
                                        {saving ? 'Saving...' : 'Save Blueprint'}
                                    </Button>
                                    {!isAuthenticated && <Typography variant="caption" color="text.secondary">Log in to save blueprints.</Typography>}
                                    <Button component={Link} to="/cart" variant="text">View Cart</Button>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default BlueprintBuilder
