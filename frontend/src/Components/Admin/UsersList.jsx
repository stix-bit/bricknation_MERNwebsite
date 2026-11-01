import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import {
    deleteAdminUser,
    getAllUsers,
    softDeleteAdminUser,
    restoreAdminUser,
    updateAdminUser
} from '../../actions/userActions'

const UsersList = () => {
    const dispatch = useDispatch()
    const { users = [], loading, actionLoading, error } = useSelector(state => state.allUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingUser, setEditingUser] = useState(null)
    const [userToDelete, setUserToDelete] = useState(null)
    const [deleteMode, setDeleteMode] = useState('soft')

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editingUser?.name || '',
            email: editingUser?.email || '',
            role: editingUser?.role || 'user'
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required('Name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            role: Yup.string().oneOf(['user', 'admin']).required('Role is required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const updated = await dispatch(updateAdminUser(editingUser._id, values))
            if (updated) {
                setEditingUser(null)
                dispatch(getAllUsers())
            }
            setSubmitting(false)
        }
    })

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    const openEditDialog = user => {
        setEditingUser(user)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return
        const deleted = deleteMode === 'soft'
            ? await dispatch(softDeleteAdminUser(userToDelete._id))
            : deleteMode === 'restore'
                ? await dispatch(restoreAdminUser(userToDelete._id))
                : await dispatch(deleteAdminUser(userToDelete._id))
        if (deleted) setUserToDelete(null)
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredUsers = users.filter(user => {
        if (!normalizedSearchTerm) return true

        return [
            user.name,
            user.email,
            user._id,
            user.role,
            user.isDeleted ? 'suspended' : 'active'
        ].some(value => String(value || '').toLowerCase().includes(normalizedSearchTerm))
    })

    return (
        <>
            <MetaData title="All Users" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3, minHeight: '80vh' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, textAlign: 'left' }}>
                        <div>
                            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Users
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                Manage registered customer profiles, administrative roles, and access status
                            </Typography>
                        </div>
                        <TextField
                            size="small"
                            placeholder="Search by name, email, role, or ID..."
                            aria-label="Search users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 260 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i className="fa fa-search" style={{ color: '#888' }}></i>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 8 }}>
                                <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading users...</Typography>
                            </Stack>
                        ) : (
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ '& th': { bgcolor: 'rgba(0, 0, 0, 0.02)', fontWeight: 700 } }}>
                                            <TableCell>User</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map(user => (
                                            <TableRow key={user._id} hover>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar src={user.avatar?.url} alt={user.name} sx={{ width: 40, height: 40 }}>
                                                            {(user.name || 'U').charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography fontWeight={600} variant="body2">{user.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                                {user._id}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{user.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={user.role}
                                                        color={user.role === 'admin' ? 'primary' : 'default'}
                                                        variant={user.role === 'admin' ? 'filled' : 'outlined'}
                                                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={user.isDeleted ? 'Suspended' : 'Active'}
                                                        color={user.isDeleted ? 'warning' : 'success'}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => openEditDialog(user)}
                                                            sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            color={user.isDeleted ? 'success' : 'warning'}
                                                            variant="outlined"
                                                            disabled={actionLoading}
                                                            onClick={() => {
                                                                setDeleteMode(user.isDeleted ? 'restore' : 'soft')
                                                                setUserToDelete(user)
                                                            }}
                                                            sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                                        >
                                                            {user.isDeleted ? 'Restore' : 'Suspend'}
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            disabled={actionLoading}
                                                            onClick={() => {
                                                                setDeleteMode('hard')
                                                                setUserToDelete(user)
                                                            }}
                                                            sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                                    <Typography color="text.secondary">
                                                        {searchTerm ? `No users matching "${searchTerm}"` : 'No users found.'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* Modify User Dialog */}
            <Dialog
                open={Boolean(editingUser)}
                onClose={() => !actionLoading && setEditingUser(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Modify User Details
                </DialogTitle>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <DialogContent>
                        <Stack spacing={2.5} sx={{ pt: 1 }}>
                            <TextField
                                label="Full Name"
                                {...formik.getFieldProps('name')}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                fullWidth
                            />
                            <TextField
                                label="Email Address"
                                type="email"
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                fullWidth
                            />
                            <FormControl
                                fullWidth
                                error={formik.touched.role && Boolean(formik.errors.role)}
                            >
                                <InputLabel id="role-select-label">Account Role</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    {...formik.getFieldProps('role')}
                                    label="Account Role"
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin">Administrator</MenuItem>
                                </Select>
                                {formik.touched.role && formik.errors.role && (
                                    <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.75 }}>
                                        {formik.errors.role}
                                    </Typography>
                                )}
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button onClick={() => setEditingUser(null)} disabled={actionLoading} sx={{ textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={actionLoading || formik.isSubmitting}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                bgcolor: 'var(--red, #e30620)',
                                '&:hover': { bgcolor: 'var(--red-dark, #ad071d)' }
                            }}
                        >
                            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Suspend / Restore / Hard Delete Confirmation Dialog */}
            <Dialog
                open={Boolean(userToDelete)}
                onClose={() => !actionLoading && setUserToDelete(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {deleteMode === 'soft' ? 'Suspend User?' : deleteMode === 'restore' ? 'Restore User?' : 'Permanently Delete User?'}
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {deleteMode === 'soft'
                            ? `Suspend ${userToDelete?.name || 'this user'} without permanently removing the account. They will not be able to log in.`
                            : deleteMode === 'restore'
                                ? `Restore ${userToDelete?.name || 'this user'} and re-enable their account access.`
                                : `Permanently delete ${userToDelete?.name || 'this user'} and all associated records. This action cannot be undone.`}
                    </Typography>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setUserToDelete(null)} disabled={actionLoading} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        color={deleteMode === 'soft' ? 'warning' : deleteMode === 'restore' ? 'success' : 'error'}
                        variant="contained"
                        onClick={confirmDelete}
                        disabled={actionLoading}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        {actionLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : deleteMode === 'soft' ? (
                            'Suspend'
                        ) : deleteMode === 'restore' ? (
                            'Restore'
                        ) : (
                            'Delete permanently'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UsersList
