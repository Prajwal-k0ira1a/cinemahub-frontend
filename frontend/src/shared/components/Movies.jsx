import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Star, Film, Search } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL, API_SERVER_URL } from "../config/api";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop";

const getMoviePosterUrl = (poster) => {
  if (!poster) return FALLBACK_POSTER;
  if (/^https?:\/\//i.test(poster)) return poster;
  return `${API_SERVER_URL}/uploads/${poster}`;
};

const normalizeTags = (genre) => {
  if (Array.isArray(genre)) return genre.slice(0, 2);
  if (typeof genre === "string") {
    return genre
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 2);
  }
  return ["Movie"];
};

const normalizeDuration = (duration) => {
  const value = Number(duration);
  if (!Number.isFinite(value) || value <= 0) return "N/A";
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return `${hours}h ${mins}m`;
};

const normalizeYear = (releaseDate) => {
  if (!releaseDate) return "TBA";
  const parsed = new Date(releaseDate);
  return Number.isNaN(parsed.getTime()) ? "TBA" : String(parsed.getFullYear());
};

const MovieCard = ({ movie }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHovered, setIsHovered] = useState(false);
  const showDetails = isMobile || isHovered;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 345 },
        minHeight: { xs: "auto", sm: 420 },
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "12px", sm: "18px" },
        border: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#141414",
        color: "#fff",
        boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
        transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(229,9,20,0.45)",
          boxShadow: "0 24px 70px rgba(229,9,20,0.16)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={`${movie.title} movie card`}
    >
      <CardMedia
        component="img"
        alt={`${movie.title} poster`}
        image={movie.image}
        sx={{
          height: { xs: 240, sm: 420 },
          objectFit: "cover",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.82) 58%, rgba(0,0,0,0.94) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 1.25 },
          opacity: showDetails ? 1 : 0,
          visibility: showDetails ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
          pointerEvents: showDetails ? "auto" : "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Chip
            label={movie.year}
            size="small"
            sx={{
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.58)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontWeight: 700,
            }}
          />
          <Chip
            icon={<Star size={13} fill="currentColor" />}
            label={movie.rating.toFixed(1)}
            size="small"
            sx={{
              color: "#ffd54f",
              backgroundColor: "rgba(0,0,0,0.58)",
              border: "1px solid rgba(255,213,79,0.22)",
              fontWeight: 700,
              "& .MuiChip-icon": { color: "#ffd54f" },
            }}
          />
        </Box>

        <Box>
          <CardContent sx={{ px: { xs: 0.5, sm: 2 }, pb: 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.15rem", sm: "1.5rem" }, lineHeight: 1.15 }}
            >
              {movie.title}
            </Typography>
            <Typography sx={{ mb: 1.25, color: "rgba(255,255,255,0.72)", fontSize: { xs: 13, sm: 14 } }}>
              {movie.director}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", display: "flex", alignItems: "center", gap: 0.8, fontSize: { xs: 13, sm: 14 } }}>
                <Clock3 size={14} />
                {movie.duration}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", display: "flex", alignItems: "center", gap: 0.8, fontSize: { xs: 13, sm: 14 } }}>
                <Film size={14} />
                {movie.tags.join(" | ")}
              </Typography>
            </Box>
          </CardContent>

          <CardActions
            sx={{
              justifyContent: "space-around",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "stretch",
              px: { xs: 1, sm: 2 },
              pb: { xs: 1, sm: 2 },
              pt: 0.5,
              gap: { xs: 1, sm: 0 },
            }}
          >
            {movie.id ? (
              <Button
                component={Link}
                to={`/movies/${movie.id}`}
                size="small"
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: 999,
                  backgroundColor: "#e50914",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#c80811" },
                }}
              >
                Buy Tickets
              </Button>
            ) : (
              <Button size="small" variant="contained" disabled sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}>
                Buy Tickets
              </Button>
            )}

            {movie.id ? (
              <Button
                component={Link}
                to={`/movies/${movie.id}`}
                size="small"
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: 999,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.72)",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Watch Trailer
              </Button>
            ) : (
              <Button size="small" variant="outlined" disabled sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}>
                Watch Trailer
              </Button>
            )}
          </CardActions>
        </Box>
      </Box>

      {!isHovered ? (
        <Box
          sx={{
            position: "absolute",
            inset: "auto 0 0 0",
            p: { xs: 1.25, sm: 1.5 },
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)",
            display: { xs: "none", sm: "block" },
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
            {movie.title}
          </Typography>
        </Box>
      ) : null}
    </Card>
  );
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/movie/get`, {
          withCredentials: true,
        });

        if (response.data?.success && Array.isArray(response.data.data)) {
          const mappedMovies = response.data.data.map((movie) => ({
            id: movie.id,
            title: movie.movie_title || movie.title || "Untitled",
            year: normalizeYear(movie.releaseDate),
            director: movie.director || "Director unavailable",
            duration: normalizeDuration(movie.duration),
            rating: Number(movie.rating) || 4.0,
            tags: normalizeTags(movie.genre),
            image: getMoviePosterUrl(movie.moviePoster),
          }));
          setMovies(mappedMovies);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const topCountLabel = useMemo(() => `${movies.length} titles`, [movies.length]);
  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return movies;

    return movies.filter((movie) =>
      [movie.title, movie.director, movie.year, movie.duration, movie.tags.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [movies, search]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <Paper
          sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(24,24,27,0.96) 0%, rgba(14,14,16,0.98) 100%)",
            color: "#fff",
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff" }}>
                  Now Playing
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: { xs: 13, sm: 14 }, color: "rgba(255,255,255,0.68)" }}>
                  Browse and book from currently listed movies.
                </Typography>
              </Box>
              <Chip
                label={topCountLabel}
                sx={{
                  borderRadius: 999,
                  color: "#fff",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />
            </Stack>

            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, genres, year..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#94a3b8" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.22)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e50914",
                  },
                },
              }}
            />

            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
              Showing <Box component="span" sx={{ fontWeight: 700, color: "#fff" }}>{filteredMovies.length}</Box> of{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#fff" }}>{movies.length}</Box> movies
            </Typography>
          </Stack>
        </Paper>

        {loading ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Loading movies...
          </Paper>
        ) : movies.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.68)",
            }}
          >
            No movies available right now.
          </Paper>
        ) : filteredMovies.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.68)",
            }}
          >
            No movies match your search.
          </Paper>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={`${movie.id || movie.title}-${index}`} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Movies;
