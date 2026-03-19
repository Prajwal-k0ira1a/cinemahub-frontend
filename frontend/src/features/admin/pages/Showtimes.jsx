import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
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
  Typography,
} from "@mui/material";
import { CalendarDays, Clock3, Edit2, Plus, Search, Trash2, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../../shared/config/api.js";
import { useAuth } from "../../../shared/hooks/useAuth.js";

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const toInputTime = (value) => (value ? String(value).slice(0, 5) : "");
const formatTime = (value) => (value ? String(value).slice(0, 5) : "--:--");
const todayString = () => new Date().toISOString().slice(0, 10);

const defaultStartTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(Math.ceil(now.getMinutes() / 5) * 5).padStart(2, "0");
  return `${hour}:${minute === "60" ? "00" : minute}`;
};

const Showtimes = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [filterMovieId, setFilterMovieId] = useState("");
  const [filterHallroomId, setFilterHallroomId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [error, setError] = useState("");

  const [createForm, setCreateForm] = useState({
    movieId: "",
    hallroomId: "",
    show_date: "",
    start_time: "",
  });

  const [editForm, setEditForm] = useState({
    show_date: "",
    start_time: "",
  });

  const hasActiveFilters = Boolean(filterMovieId || filterHallroomId || filterDate || query.trim());

  const fetchBaseData = async () => {
    try {
      const [moviesRes, roomsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/movie/get`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/hall-room/get`, { withCredentials: true }),
      ]);

      const moviesData = moviesRes.data?.success ? moviesRes.data.data || [] : [];
      const roomsData = roomsRes.data?.success ? roomsRes.data.data || [] : [];

      setMovies(moviesData);
      setRooms(roomsData);

      setCreateForm((prev) => ({
        ...prev,
        movieId: prev.movieId || (moviesData[0]?.id ? String(moviesData[0].id) : ""),
        hallroomId: prev.hallroomId || (roomsData[0]?.id ? String(roomsData[0].id) : ""),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load movies/hallrooms");
    }
  };

  const fetchShowtimes = async () => {
    try {
      const params = {};
      if (filterMovieId) params.movieId = filterMovieId;
      if (filterHallroomId) params.hallroomId = filterHallroomId;
      if (filterDate) params.showDate = filterDate;

      const response = await axios.get(`${API_BASE_URL}/showtime/get`, {
        params,
        withCredentials: true,
      });

      if (response.data?.success) {
        setShowtimes(response.data.data || []);
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message || err.response?.data?.error;
      toast.error(apiMessage || "Failed to fetch showtimes");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      await fetchBaseData();
      setInitialized(true);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (!initialized || !isAuthenticated) return;
    fetchShowtimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isAuthenticated, filterMovieId, filterHallroomId, filterDate]);

  const openEditModal = (showtime) => {
    setEditingShowtime(showtime);
    setEditForm({
      show_date: toInputDate(showtime.show_date),
      start_time: toInputTime(showtime.start_time),
    });
  };

  const closeEditModal = () => {
    setEditingShowtime(null);
    setEditForm({ show_date: "", start_time: "" });
  };

  const openCreateModal = () => {
    setCreateForm((prev) => ({
      ...prev,
      show_date: prev.show_date || todayString(),
      start_time: prev.start_time || defaultStartTime(),
    }));
    setShowCreateModal(true);
  };

  const clearFilters = () => {
    setQuery("");
    setFilterMovieId("");
    setFilterHallroomId("");
    setFilterDate("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.movieId || !createForm.hallroomId || !createForm.show_date || !createForm.start_time) {
      toast.error("All create fields are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await axios.post(
        `${API_BASE_URL}/showtime/create-showtime/${createForm.movieId}/${createForm.hallroomId}`,
        {
          show_date: createForm.show_date,
          start_time: createForm.start_time,
        },
        { withCredentials: true },
      );
      toast.success("Showtime created");
      setShowCreateModal(false);
      await fetchShowtimes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create showtime");
      toast.error(err.response?.data?.message || "Failed to create showtime");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingShowtime) return;
    if (!editForm.show_date || !editForm.start_time) {
      toast.error("Both date and time are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await axios.put(
        `${API_BASE_URL}/showtime/update-showtime/${editingShowtime.id}`,
        {
          show_date: editForm.show_date,
          start_time: editForm.start_time,
        },
        { withCredentials: true },
      );
      toast.success("Showtime updated");
      closeEditModal();
      await fetchShowtimes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update showtime");
      toast.error(err.response?.data?.message || "Failed to update showtime");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (showtimeId) => {
    if (!window.confirm("Delete this showtime?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/showtime/delete/${showtimeId}`, {
        withCredentials: true,
      });
      toast.success("Showtime deleted");
      await fetchShowtimes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete showtime");
    }
  };

  const filteredByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return showtimes;
    return showtimes.filter((showtime) => {
      const movieTitle = showtime.Movie?.movie_title || "";
      const roomName = showtime.Hallroom?.roomName || "";
      const hallName = showtime.Hallroom?.Hall?.hall_name || "";
      return [movieTitle, roomName, hallName, showtime.show_date].join(" ").toLowerCase().includes(q);
    });
  }, [query, showtimes]);

  const upcomingCount = useMemo(() => {
    const today = todayString();
    return showtimes.filter((item) => (item.show_date || "") >= today).length;
  }, [showtimes]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Showtime Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {user?.role === "hall-admin"
              ? "Manage schedules for your hallrooms."
              : "Create, update, and remove movie schedules by hallroom."}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total: {showtimes.length} | Upcoming: {upcomingCount}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={openCreateModal}
          disabled={movies.length === 0 || rooms.length === 0}
        >
          Add Showtime
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 1.5, mb: 2, border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by movie, hall, room, date..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <Select
              fullWidth
              size="small"
              value={filterMovieId}
              onChange={(e) => setFilterMovieId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Movies</MenuItem>
              {movies.map((movie) => (
                <MenuItem key={movie.id} value={movie.id}>
                  {movie.movie_title}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <Select
              fullWidth
              size="small"
              value={filterHallroomId}
              onChange={(e) => setFilterHallroomId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Hallrooms</MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.Hall?.hall_name ? `${room.Hall.hall_name} - ` : ""}{room.roomName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarDays size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={() => setFilterDate(todayString())}>
                Today
              </Button>
              <Button variant="text" size="small" onClick={clearFilters} disabled={!hasActiveFilters}>
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {loading ? (
          <LinearProgress />
        ) : filteredByQuery.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No showtimes found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Movie</TableCell>
                  <TableCell>Hall / Room</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredByQuery.map((showtime) => (
                  <TableRow hover key={showtime.id}>
                    <TableCell>{showtime.Movie?.movie_title || "Unknown movie"}</TableCell>
                    <TableCell>
                      {(showtime.Hallroom?.Hall?.hall_name || "Unknown hall") + " / " + (showtime.Hallroom?.roomName || "Unknown room")}
                    </TableCell>
                    <TableCell>{showtime.show_date || "N/A"}</TableCell>
                    <TableCell>{formatTime(showtime.start_time)}</TableCell>
                    <TableCell>{formatTime(showtime.end_time)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton size="small" color="primary" onClick={() => openEditModal(showtime)}>
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(showtime.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>Create Showtime</Typography>
          <IconButton onClick={() => setShowCreateModal(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <DialogContent dividers>
          <form id="create-showtime-form" onSubmit={handleCreate}>
            <Stack spacing={2}>
              <TextField
                select
                label="Movie"
                value={createForm.movieId}
                onChange={(e) => setCreateForm((p) => ({ ...p, movieId: e.target.value }))}
                fullWidth
                required
              >
                {movies.map((movie) => (
                  <MenuItem key={movie.id} value={movie.id}>
                    {movie.movie_title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Hallroom"
                value={createForm.hallroomId}
                onChange={(e) => setCreateForm((p) => ({ ...p, hallroomId: e.target.value }))}
                fullWidth
                required
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.Hall?.hall_name ? `${room.Hall.hall_name} - ` : ""}{room.roomName}
                  </MenuItem>
                ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Show Date"
                    type="date"
                    value={createForm.show_date}
                    onChange={(e) => setCreateForm((p) => ({ ...p, show_date: e.target.value }))}
                    fullWidth
                    InputProps={{ inputProps: { min: todayString() } }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm((p) => ({ ...p, start_time: e.target.value }))}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setShowCreateModal(false)} color="inherit">Cancel</Button>
          <Button type="submit" form="create-showtime-form" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Create Showtime"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingShowtime)} onClose={closeEditModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>Edit Showtime</Typography>
          <IconButton onClick={closeEditModal}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <DialogContent dividers>
          <form id="edit-showtime-form" onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Show Date"
                  type="date"
                  value={editForm.show_date}
                  onChange={(e) => setEditForm((p) => ({ ...p, show_date: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={editForm.start_time}
                  onChange={(e) => setEditForm((p) => ({ ...p, start_time: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeEditModal} color="inherit">Cancel</Button>
          <Button type="submit" form="edit-showtime-form" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Update Showtime"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Showtimes;
