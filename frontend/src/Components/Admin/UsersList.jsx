import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
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
    const { users, loading, actionLoading, error } = useSelector(state => state.allUsers)
    const [editingUser, setEditingUser] = useState(null)
    const [userToDelete, setUserToDelete] = useState(null)
    const [deleteMode, setDeleteMode] = useState('soft')
    const [form, setForm] = useState({ name: '', email: '', role: 'user' })

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    const openEditDialog = user => {
        setEditingUser(user)
        setForm({ name: user.name, email: user.email, role: user.role })
    }

    const submitEdit = async event => {
        event.preventDefault()
        const updated = await dispatch(updateAdminUser(editingUser._id, form))
        if (updated) {
            setEditingUser(null)
            dispatch(getAllUsers())
        }
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

    return (
        <>
            <MetaData title="All Users" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3 }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>
                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Users</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 8 }}>
                                <CircularProgress />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading users...</Typography>
                            </Stack>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user._id} hover>
                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar src={user.avatar?.url} alt={user.name}>
                                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography fontWeight={600}>{user.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="small" label={user.isDeleted ? 'Archived' : 'Active'}
                                                    color={user.isDeleted ? 'warning' : 'success'} variant="outlined" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                                                    <Button size="small" variant="outlined" onClick={() => openEditDialog(user)}>
                                                        Edit
                                                    </Button>
                                                    <Button size="small" color={user.isDeleted ? 'success' : 'warning'} variant="outlined"
                                                        disabled={actionLoading}
                                                        onClick={() => {
                                                            setDeleteMode(user.isDeleted ? 'restore' : 'soft')
                                                            setUserToDelete(user)
                                                        }}>
                                                        {user.isDeleted ? 'Restore' : 'Archive'}
                                                    </Button>
                                                    <Button size="small" color="error" variant="outlined"
                                                        disabled={actionLoading}
                                                        onClick={() => { setDeleteMode('hard'); setUserToDelete(user) }}>
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No users found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </Box>
            </Box>

            <Dialog open={Boolean(editingUser)} onClose={() => !actionLoading && setEditingUser(null)}
                fullWidth maxWidth="sm">
                <DialogTitle>Modify user</DialogTitle>
                <Box component="form" onSubmit={submitEdit}>
                    <DialogContent>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <TextField label="Name" value={form.name} required
                                onChange={event => setForm({ ...form, name: event.target.value })} />
                            <TextField label="Email" type="email" value={form.email} required
                                onChange={event => setForm({ ...form, email: event.target.value })} />
                            <Select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setEditingUser(null)} disabled={actionLoading}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={actionLoading}>
                            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Save changes'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={Boolean(userToDelete)} onClose={() => !actionLoading && setUserToDelete(null)}
                maxWidth="xs" fullWidth>
                <DialogTitle>
                    {deleteMode === 'soft' ? 'Archive user?' : deleteMode === 'restore' ? 'Restore user?' : 'Permanently delete user?'}
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {deleteMode === 'soft'
                            ? `Disable ${userToDelete?.name || 'this user'} without permanently removing the account.`
                            : deleteMode === 'restore'
                                ? `Restore ${userToDelete?.name || 'this user'} and allow the account to log in again.`
                            : `Permanently remove ${userToDelete?.name || 'this user'} and related data. This cannot be undone.`}
                    </Typography>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setUserToDelete(null)} disabled={actionLoading}>Cancel</Button>
                    <Button color={deleteMode === 'soft' ? 'warning' : deleteMode === 'restore' ? 'success' : 'error'} variant="contained"
                        onClick={confirmDelete} disabled={actionLoading}>
                        {actionLoading
                            ? <CircularProgress size={20} color="inherit" />
                            : deleteMode === 'soft' ? 'Archive' : deleteMode === 'restore' ? 'Restore' : 'Delete permanently'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UsersList
