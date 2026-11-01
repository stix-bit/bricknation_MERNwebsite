import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from '@mui/material'
import MetaData from '../Layout/MetaData'

const departmentDetails = {
    Materials: {
        icon: 'fa-cubes',
        color: '#d32f2f',
        bg: 'rgba(211, 47, 47, 0.08)',
        description: 'Portland cement, structural rebar, exterior plywood, PVC piping, galvanized roofing, and solid clay masonry supplies.',
        popularItems: ['Cement', 'Rebar', 'Plywood', 'Roofing', 'Masonry']
    },
    Tools: {
        icon: 'fa-wrench',
        color: '#1976d2',
        bg: 'rgba(25, 118, 210, 0.08)',
        description: 'Drop-forged claw hammers, precision spirit levels, adjustable wrenches, aggressive saws, magnetic screwdrivers, and tape measures.',
        popularItems: ['Hammers', 'Levels', 'Wrenches', 'Saws', 'Measuring']
    },
    Equipment: {
        icon: 'fa-truck',
        color: '#2e7d32',
        bg: 'rgba(46, 125, 50, 0.08)',
        description: 'Telescoping ladders, steel wheelbarrows, hydraulic floor jacks, convertible hand trucks, workbenches, and pressure washers.',
        popularItems: ['Ladders', 'Dollies', 'Jacks', 'Workbenches', 'Washers']
    },
    Design: {
        icon: 'fa-paint-brush',
        color: '#9c27b0',
        bg: 'rgba(156, 39, 176, 0.08)',
        description: 'Modern door levers, brushed brass cabinet pulls, laser distance measurers, drafting squares, green-beam cross-line lasers, and barn door kits.',
        popularItems: ['Hardware', 'Cabinet Pulls', 'Lasers', 'Hinges', 'Drafting']
    },
    Consumables: {
        icon: 'fa-tags',
        color: '#ed6c02',
        bg: 'rgba(237, 108, 2, 0.08)',
        description: 'Expanding insulation foam, waterproof silicone sealants, wood screw assortments, heavy-duty duct tape, sandpaper packs, and painter tape.',
        popularItems: ['Fasteners', 'Sealants', 'Adhesives', 'Abrasives', 'Tapes']
    },
    Electrical: {
        icon: 'fa-bolt',
        color: '#0288d1',
        bg: 'rgba(2, 136, 209, 0.08)',
        description: 'Cordless brushless impact drills, angle grinders, THHN copper building wire, digital clamp multimeters, outdoor cords, and GFCI outlets.',
        popularItems: ['Power Tools', 'Wire Rolls', 'Testers', 'Outlets', 'Lighting']
    }
}

const CategoriesPage = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true
        fetch(`${import.meta.env.VITE_API}/categories`)
            .then(res => {
                if (!res.ok) throw new Error('Unable to load categories')
                return res.json()
            })
            .then(data => {
                if (isMounted) {
                    setCategories(data.categories || [])
                    setLoading(false)
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError(err.message)
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <>
            <MetaData title="Hardware Departments - BrickNation" />
            <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 }, minHeight: '80vh' }}>
                <Paper
                    elevation={0}
                    sx={{
                        px: { xs: 2, sm: 4 },
                        py: 1.5,
                        mb: { xs: 3, md: 4 },
                        border: '1px solid #f0ebe4',
                        borderRadius: 1,
                        boxShadow: '0 6px 18px rgba(38, 22, 10, 0.04)'
                    }}
                >
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link to="/" style={{ color: '#716d74', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                            Home
                        </Link>
                        <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            Categories
                        </Typography>
                    </Breadcrumbs>
                </Paper>

                <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: '-0.03em',
                            mb: 1,
                            fontSize: { xs: '2.25rem', sm: '2.75rem' }
                        }}
                    >
                        Hardware Departments
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto', lineHeight: 1.5 }}>
                        Browse our comprehensive inventory of structural building supplies, contractor-grade tools, heavy machinery, and everyday jobsite consumables.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ py: 12, textAlign: 'center' }}>
                        <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                            Loading departments...
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center">
                        {categories.map(cat => {
                            const details = departmentDetails[cat.name] || {
                                icon: 'fa-cube',
                                color: '#1976d2',
                                bg: 'rgba(25, 118, 210, 0.08)',
                                description: 'Explore quality hardware and workshop supplies tailored for residential and commercial construction.',
                                popularItems: []
                            }

                            return (
                                <Grid size={{ xs: 12, sm: 6 }} key={cat._id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            border: '1px solid',
                                            borderColor: cat.name === 'Consumables' ? '#f0d7c1' : 'divider',
                                            borderRadius: 2.5,
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pb: { xs: 2.5, sm: 3 } }}>
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.25 }}>
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 2,
                                                        bgcolor: details.bg,
                                                        color: details.color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <i className={`fa ${details.icon} fa-2x`}></i>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                        sx={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: { xs: '1.35rem', sm: '1.5rem' } }}
                                                    >
                                                        {cat.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        DEPARTMENT
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                                                {details.description}
                                            </Typography>

                                            {details.popularItems.length > 0 && (
                                                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                                                    {details.popularItems.map(item => (
                                                        <Chip
                                                            key={item}
                                                            label={item}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                                                bgcolor: '#faf8f5'
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            )}
                                        </CardContent>

                                        <Box>
                                            <Divider />
                                            <CardActions sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid #eee7df' }}>
                                                <Button
                                                    component={Link}
                                                    to={`/?category=${cat._id}`}
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: 'var(--red, #e30620)',
                                                        color: '#fff',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        '&:hover': { bgcolor: 'var(--red-dark, #ad071d)' }
                                                    }}
                                                    endIcon={<i className="fa fa-arrow-right"></i>}
                                                >
                                                    Browse {cat.name}
                                                </Button>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                )}

                {/* Bottom Assistance Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 6,
                        p: 4,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(135deg, #fffdf8 0%, #f7f3eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Can't find a specific hardware material or tool?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Search our complete hardware store catalog by keyword, model number, or brand name.
                        </Typography>
                    </Box>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        sx={{
                            color: 'var(--ink, #17151b)',
                            borderColor: 'rgba(23, 21, 27, 0.3)',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            '&:hover': { borderColor: 'var(--ink, #17151b)', bgcolor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                    >
                        View All Products
                    </Button>
                </Paper>
            </Container>
        </>
    )
}

export default CategoriesPage
