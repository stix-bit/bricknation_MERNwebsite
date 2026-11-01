import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import { Chat, Close, Send, ShoppingCart, SmartToy } from '@mui/icons-material'
import { addItemToCart } from '../../actions/cartActions'
import { formatPeso } from '../../Utils/helpers'

const BobAssistant = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [recommendations, setRecommendations] = useState([])
    const [message, setMessage] = useState('Hi, I am Bob the Builder. Tell me what you want to build and I will prepare a rough materials list.')

    const total = useMemo(
        () => recommendations.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
        [recommendations]
    )

    const generateEstimate = async () => {
        const request = prompt.trim()
        if (!request) return

        setLoading(true)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API}/bob/chat`, { prompt: request })
            setRecommendations(data.recommendations || [])
            setMessage(data.message || 'Here is a rough materials estimate for your project.')
        } catch (error) {
            setMessage(error.response?.data?.message || 'I could not load BrickNation inventory right now.')
        } finally {
            setLoading(false)
        }
    }

    const addAllToCart = async () => {
        for (const item of recommendations) {
            await dispatch(addItemToCart(item.product._id, item.quantity))
        }
        setMessage('Done. I added the estimate to your cart.')
    }

    return (
        <>
            {open && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        right: { xs: 12, sm: 24 },
                        bottom: { xs: 76, sm: 90 },
                        width: { xs: 'calc(100vw - 24px)', sm: 390 },
                        maxHeight: 'min(650px, calc(100vh - 110px))',
                        zIndex: 1300,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ bgcolor: 'var(--ink, #17151b)', color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                            <Avatar sx={{ bgcolor: 'var(--red, #e30620)', width: 34, height: 34 }}><SmartToy fontSize="small" /></Avatar>
                            <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                                <Typography fontWeight={700} noWrap sx={{ display: 'block', textAlign: 'left', lineHeight: 1.15, fontSize: { xs: '0.95rem', sm: '1rem' } }}>Bob the Builder</Typography>
                                <Typography variant="caption" noWrap sx={{ display: 'block', textAlign: 'left', color: 'rgba(255,255,255,.7)' }}>Home Generator Assistant</Typography>
                            </Box>
                        </Stack>
                        <IconButton aria-label="Close Bob assistant" onClick={() => setOpen(false)} sx={{ color: '#fff', flexShrink: 0, p: 0.75 }}><Close /></IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ p: 2, maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
                        <Typography variant="body2" color="text.secondary">{message}</Typography>
                        {recommendations.length > 0 && (
                            <Stack spacing={1}>
                                {recommendations.map(item => (
                                    <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>{item.quantity} x {item.product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">₱{formatPeso(item.product.price * item.quantity)}</Typography>
                                    </Box>
                                ))}
                                <Divider />
                                <Typography fontWeight={700}>Estimated total: ₱{formatPeso(total)}</Typography>
                                <Button variant="contained" startIcon={<ShoppingCart />} onClick={addAllToCart}>Add All to Cart</Button>
                            </Stack>
                        )}
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={prompt}
                            onChange={event => setPrompt(event.target.value)}
                            placeholder="Example: I want to build a 10x10 ft concrete shed."
                            onKeyDown={event => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault()
                                    generateEstimate()
                                }
                            }}
                        />
                        <Button variant="outlined" endIcon={loading ? <CircularProgress size={16} /> : <Send />} onClick={generateEstimate} disabled={loading || !prompt.trim()}>
                            Generate Estimate
                        </Button>
                    </Stack>
                </Paper>
            )}
            <IconButton
                aria-label={open ? 'Close Bob assistant' : 'Open Bob assistant'}
                onClick={() => setOpen(current => !current)}
                sx={{
                    position: 'fixed',
                    right: { xs: 12, sm: 24 },
                    bottom: { xs: 12, sm: 24 },
                    zIndex: 1301,
                    width: 56,
                    height: 56,
                    color: '#fff',
                    bgcolor: 'var(--red, #e30620)',
                    boxShadow: 5,
                    '&:hover': { bgcolor: 'var(--red-dark, #ad071d)' }
                }}
            >
                {open ? <Close /> : <Chat />}
            </IconButton>
        </>
    )
}

export default BobAssistant
