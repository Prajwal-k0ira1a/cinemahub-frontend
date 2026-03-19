import React, { useEffect, useState } from "react";
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
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus, Search, Edit2, Trash2, Upload, Film, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL, API_SERVER_URL } from "../../../shared/config/api";

const toCastRows = (movie) => {
  const castNames = Array.isArray(movie?.casts)
    ? movie.casts
    : typeof movie?.casts === "string"
      ? movie.casts.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  const castImages = Array.isArray(movie?.castImages) ? movie.castImages : [];

  if (castNames.length === 0) return [{ name: "", imageFile: null, existingImage: null }];

  return castNames.map((name, index) => ({
    name,
    imageFile: null,
    existingImage: castImages[index] ?? null,
  }));
};

const createEmptyCastRow = () => ({ name: "", imageFile: null, existingImage: null });

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    movie_title: "",
    description: "",
    director: "",
    writer: "",
    castRows: [createEmptyCastRow()],
    genre: "",
    duration: "",
    moviePoster: null,
    movieTrailer: null,
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/movie/get`, { withCredentials: true });
      if (response.data.success) setMovies(response.data.data);
    } catch (err) {
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleCastNameChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      castRows: prev.castRows.map((row, idx) => (idx === index ? { ...row, name: value } : row)),
    }));
  };

  const handleCastImageChange = (index, file) => {
    setFormData((prev) => ({
      ...prev,
      castRows: prev.castRows.map((row, idx) =>
        idx === index
          ? { ...row, imageFile: file || null, existingImage: file ? null : row.existingImage }
          : row,
      ),
    }));
  };

  const addCastRow = () => {
    setFormData((prev) => ({ ...prev, castRows: [...prev.castRows, createEmptyCastRow()] }));
  };

  const removeCastRow = (index) => {
    setFormData((prev) => {
      const next = prev.castRows.filter((_, idx) => idx !== index);
      return { ...prev, castRows: next.length > 0 ? next : [createEmptyCastRow()] };
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      movie_title: "",
      description: "",
      director: "",
      writer: "",
      castRows: [createEmptyCastRow()],
      genre: "",
      duration: "",
      moviePoster: null,
      movieTrailer: null,
    });
    setEditingMovie(null);
    setError("");
    setSubmitting(false);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.movie_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const validateStepOne = () => {
    if (!formData.movie_title.trim()) return toast.error("Movie title is required");
    if (!formData.genre.trim()) return toast.error("Genre is required");
    if (!String(formData.duration).trim()) return toast.error("Duration is required");
    if (!formData.description.trim()) return toast.error("Description is required");
    if (!editingMovie && !formData.moviePoster) return toast.error("Poster is required");
    if (!editingMovie && !formData.movieTrailer) return toast.error("Trailer is required");
    return true;
  };

  const handleNextStep = () => {
    if (!validateStepOne()) return;
    setCurrentStep(2);
  };

  const handleBackStep = () => setCurrentStep(1);

  const handleSaveMovie = async () => {
    if (currentStep !== 2) return;
    setSubmitting(true);
    setError("");

    const normalizedRows = formData.castRows
      .map((row) => ({
        name: String(row.name || "").trim(),
        imageFile: row.imageFile || null,
        existingImage: typeof row.existingImage === "string" ? row.existingImage.trim() : null,
      }))
      .filter((row) => row.name.length > 0);

    const castProfiles = [];
    let imageFileIndex = 0;
    const data = new FormData();
    data.append("movie_title", formData.movie_title);
    data.append("description", formData.description);
    data.append("director", formData.director);
    data.append("writer", formData.writer);
    data.append("genre", formData.genre);
    data.append("duration", formData.duration);

    normalizedRows.forEach((row) => {
      const profile = { name: row.name };
      if (row.imageFile) {
        data.append("castImages", row.imageFile);
        profile.imageFileIndex = imageFileIndex;
        imageFileIndex += 1;
      } else if (row.existingImage) {
        profile.image = row.existingImage;
      }
      castProfiles.push(profile);
    });
    data.append("castProfiles", JSON.stringify(castProfiles));
    if (formData.moviePoster) data.append("moviePoster", formData.moviePoster);
    if (formData.movieTrailer) data.append("movieTrailer", formData.movieTrailer);

    try {
      if (editingMovie) {
        await axios.put(`${API_BASE_URL}/movie/update/${editingMovie.id}`, data, {
          withCredentials: true,
        });
        toast.success("Movie updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/movie/register`, data, { withCredentials: true });
        toast.success("Movie registered successfully");
      }
      setShowModal(false);
      fetchMovies();
      resetForm();
    } catch (err) {
      console.error("Movie save error", err.response || err.message);
      setError(err.response?.data?.error || err.response?.data?.message || "Operation failed");
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/movie/delete/${id}`, { withCredentials: true });
      toast.success("Movie deleted successfully");
      fetchMovies();
    } catch (err) {
      toast.error("Failed to delete movie");
    }
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setCurrentStep(1);
    setFormData({
      movie_title: movie.movie_title,
      description: movie.description,
      director: movie.director || "",
      writer: movie.writer || "",
      castRows: toCastRows(movie),
      genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "",
      duration: movie.duration,
      moviePoster: null,
      movieTrailer: null,
    });
    setShowModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Movie Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Add, edit, or remove movies from your cinema's listing.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add Movie
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}>
        <TextField
          fullWidth
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <LinearProgress color="primary" />
        ) : filteredMovies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">No movies found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <TableRow hover key={movie.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 72,
                            height: 96,
                            borderRadius: 1.5,
                            overflow: "hidden",
                            bgcolor: "background.default",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {movie.moviePoster ? (
                            <img
                              src={`${API_SERVER_URL}/uploads/${movie.moviePoster}`}
                              alt={movie.movie_title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <Film size={20} />
                          )}
                        </Box>
                        <Box>
                          <Typography fontWeight={700}>{movie.movie_title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Director: {movie.director || "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {typeof movie.genre === "string"
                          ? movie.genre
                          : Array.isArray(movie.genre)
                            ? movie.genre.join(", ")
                            : "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {movie.releaseDate
                          ? new Date(movie.releaseDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {movie.playEndDate
                          ? new Date(movie.playEndDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={movie.isPlaying ? "Now Showing" : "Coming Soon"}
                        color={movie.isPlaying ? "success" : "warning"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => openEditModal(movie)}>
                            <Edit2 size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(movie.id)}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {editingMovie ? "Edit Movie" : "Add New Movie"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Step {currentStep} of 2
            </Typography>
          </Box>
          <IconButton onClick={() => setShowModal(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        {error && (
          <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContent dividers>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip label="1. Movie Details" color={currentStep === 1 ? "primary" : "default"} />
            <Chip label="2. Team & Cast" color={currentStep === 2 ? "primary" : "default"} />
          </Stack>

          {currentStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Movie Title"
                  name="movie_title"
                  fullWidth
                  value={formData.movie_title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Genre"
                  name="genre"
                  fullWidth
                  placeholder="Action, Thriller"
                  helperText="Separate multiple genres with commas."
                  value={formData.genre}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Duration (mins)"
                  name="duration"
                  fullWidth
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                  fullWidth
                >
                  {formData.moviePoster ? formData.moviePoster.name : "Upload Poster Image"}
                  <input
                    type="file"
                    name="moviePoster"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                  fullWidth
                >
                  {formData.movieTrailer ? formData.movieTrailer.name : "Upload Trailer Video"}
                  <input
                    type="file"
                    name="movieTrailer"
                    accept="video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            </Grid>
          )}

          {currentStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Director"
                  name="director"
                  fullWidth
                  value={formData.director}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Writer"
                  name="writer"
                  fullWidth
                  value={formData.writer}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={600} gutterBottom>
                  Casts
                </Typography>
                <Stack spacing={2} sx={{ maxHeight: 320, overflowY: "auto", pr: 1 }}>
                  {formData.castRows.map((row, index) => (
                    <Paper
                      variant="outlined"
                      key={`cast-row-${index}`}
                      sx={{ p: 2, display: "grid", gap: 1, gridTemplateColumns: { md: "1fr auto auto" } }}
                    >
                      <TextField
                        size="small"
                        value={row.name}
                        onChange={(e) => handleCastNameChange(index, e.target.value)}
                        placeholder="Cast name"
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        component="label"
                        startIcon={<Upload size={14} />}
                      >
                        {row.imageFile ? "Image Selected" : row.existingImage ? "Replace Image" : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleCastImageChange(index, e.target.files?.[0] || null)}
                        />
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => removeCastRow(index)}
                      >
                        Remove
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ gridColumn: { md: "1 / -1" } }}>
                        {row.imageFile
                          ? row.imageFile.name
                          : row.existingImage
                            ? `Current image: ${row.existingImage}`
                            : "No image selected"}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
                <Button onClick={addCastRow} sx={{ mt: 1 }} size="small">
                  + Add Cast
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setShowModal(false)} color="inherit">
            Cancel
          </Button>
          {currentStep === 2 && (
            <Button variant="outlined" onClick={handleBackStep}>
              Back
            </Button>
          )}
          {currentStep === 1 ? (
            <Button variant="contained" onClick={handleNextStep} color="primary">
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSaveMovie}
              color="primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingMovie ? "Update Movie" : "Add Movie"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Movies;
