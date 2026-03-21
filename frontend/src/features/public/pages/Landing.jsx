import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Star, ChevronDown, ArrowRight, Download } from "lucide-react";
import Hero from "../../../shared/components/Hero.jsx";
import heroPoster from "../../../assets/Batman.png";
import dunePoster from "../../../assets/Dune.jpg";
import interstellarPoster from "../../../assets/interstellar.jpg";
import oppenPoster from "../../../assets/Oppenheimer.jpg";
import avatarPoster from "../../../assets/avatar.png";
import roadPoster from "../../../assets/RoadToNinja.png";
import purnaPoster from "../../../assets/purnaBahadur.png";
import sweaterPoster from "../../../assets/unkoSweater.png";

const HERO_STATS = [
  { label: "Movies Available", value: "500+" },
  { label: "Tickets Booked Weekly", value: "150+" },
  { label: "Happy Moviegoers", value: "1M+" },
];

const CURRENTLY_IN_CINEMAS = [
  {
    title: "Revoir Paris",
    genre: "Drama • Romance",
    runtime: "2h 10m",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Lemonade Sky",
    genre: "Adventure",
    runtime: "1h 55m",
    rating: "4.7",
    image: dunePoster,
  },
  {
    title: "Rising Tide",
    genre: "Action",
    runtime: "2h 05m",
    rating: "4.5",
    image: interstellarPoster,
  },
  {
    title: "Echoes of Tomorrow",
    genre: "Sci-Fi",
    runtime: "2h 20m",
    rating: "4.8",
    image: oppenPoster,
  },
  {
    title: "Street Lights",
    genre: "Romance",
    runtime: "1h 48m",
    rating: "4.6",
    image: avatarPoster,
  },
];

const TOP_MOVIES = [
  {
    title: "The Course",
    genre: "Historical Drama",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Coda",
    genre: "Musical Journey",
    rating: "4.9",
    image: purnaPoster,
  },
  {
    title: "Verdant Seas",
    genre: "Documentary",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Signal Fire",
    genre: "Thriller",
    rating: "4.7",
    image: roadPoster,
  },
  {
    title: "Twilight Riders",
    genre: "Sci-Fi",
    rating: "4.7",
    image: sweaterPoster,
  },
  {
    title: "City of Lights",
    genre: "Romantic Comedy",
    rating: "4.6",
    image: heroPoster,
  },
];

const COMING_SOON = [
  {
    title: "Sinners",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Neighborhood Watch",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Sebastian",
    image: heroPoster,
  },
  {
    title: "The Quiet",
    image: dunePoster,
  },
  {
    title: "Wicked Pain",
    image: oppenPoster,
  },
];

const TESTIMONIALS = [
  {
    name: "Mira",
    role: "Film Blogger",
    quote:
      "Ticketor is my go-to for catching premieres. Within seconds I can reserve the seat, add snacks, and share the plan with friends.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sagar",
    role: "Student",
    quote:
      "The promo codes make expensive weekends affordable, and the mobile wallet checkout is unbelievably fast.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Lina",
    role: "Producer",
    quote:
      "We use Ticketor for press screenings. The support team is responsive and capped seating makes it easy to plan invites.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Arjun",
    role: "Cinephile",
    quote:
      "Dark mode, curated lists, and summary cards keep me looped into the week's best titles.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
];

const FAQS = [
  {
    q: "Can I cancel or reschedule tickets?",
    a: "Yes, cancellation windows differ by hall and showtime. Check the policy on the booking page before you confirm.",
  },
  {
    q: "How do promo codes work?",
    a: "Enter your promo code at checkout. The discount is validated instantly and reflected before submitting payment.",
  },
  {
    q: "Is there a mobile ticket wallet?",
    a: "Every confirmed booking stores a QR code, seat map, and theater directions inside the mobile app and your confirmation email.",
  },
  {
    q: "What does 'Watch Later' mean?",
    a: "Save a movie to your watchlist and we will text you when new showtimes, trailers, or promos drop.",
  },
];

const APP_BADGES = [
  { label: "App Store", detail: "Download for iPhone & iPad" },
  { label: "Google Play", detail: "Download for Android" },
];

const sectionSurface = {
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(24,24,27,0.95) 0%, rgba(10,10,10,0.98) 100%)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
};

const cardSurface = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 7,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(28,28,30,0.98) 0%, rgba(16,16,18,0.98) 100%)",
  color: "#fff",
  boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: "rgba(229,9,20,0.45)",
    boxShadow: "0 24px 70px rgba(229,9,20,0.16)",
  },
};

const SectionHeading = ({ eyebrow, title, description, actionLabel }) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", md: "flex-end" }}
    spacing={2}
    sx={{ mb: 4 }}
  >
    <Box>
      {eyebrow ? (
        <Typography
          variant="overline"
          sx={{
            letterSpacing: "0.36em",
            color: "rgba(255,255,255,0.62)",
            display: "block",
            mb: 0.5,
          }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff" }}>
        {title}
      </Typography>
      {description ? (
        <Typography sx={{ mt: 1, maxWidth: 680, color: "rgba(255,255,255,0.68)" }}>
          {description}
        </Typography>
      ) : null}
    </Box>
    {actionLabel ? (
      <Button
        component={RouterLink}
        to="/movies"
        endIcon={<ArrowRight size={16} />}
        sx={{
          color: "#fff",
          borderRadius: 999,
          px: 2.5,
          py: 1.1,
          border: "1px solid rgba(229,9,20,0.5)",
          backgroundColor: "rgba(229,9,20,0.14)",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": {
            borderColor: "#e50914",
            backgroundColor: "rgba(229,9,20,0.22)",
          },
        }}
      >
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);

function MovieCard({ image, title, genre, runtime, rating }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      sx={{
        ...cardSurface,
        maxWidth: 345,
        minHeight: 350,
        position: "relative",
        overflow: "hidden",
        transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={`${title} movie card`}
    >
      <CardMedia
        component="img"
        alt={`${title} poster`}
        image={image}
        sx={{
          height: "100%",
          minHeight: 350,
          objectFit: "cover",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.86) 58%, rgba(0,0,0,0.94) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 1,
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mb: 1.25 }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.72)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {genre}
            </Typography>
            {rating ? (
              <Chip
                icon={<Star size={14} fill="currentColor" />}
                label={rating}
                size="small"
                sx={{
                  color: "#ffd54f",
                  borderColor: "rgba(255,213,79,0.3)",
                  backgroundColor: "rgba(255,213,79,0.08)",
                  "& .MuiChip-icon": { color: "#ffd54f" },
                }}
                variant="outlined"
              />
            ) : null}
          </Stack>

          <Typography gutterBottom variant="h5" component="div" sx={{ color: "#fff", fontWeight: 800 }}>
            {title}
          </Typography>

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            {runtime ? `${genre}${genre ? " | " : ""}${runtime}` : genre}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-around",
            px: 2,
            pb: 2,
            pt: 0.5,
          }}
        >
          <Button
            component={RouterLink}
            to="/movies"
            size="small"
            variant="contained"
            sx={{
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
          <Button
            component={RouterLink}
            to="/movies"
            size="small"
            variant="outlined"
            sx={{
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
        </CardActions>
      </Box>
    </Card>
  );
}

const ComingSoonCard = ({ title, image }) => (
  <Card sx={{ ...cardSurface, position: "relative", overflow: "hidden" }}>
    <CardMedia component="img" image={image} alt={`${title} preview`} sx={{ height: 340 }} />
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.82) 100%)",
      }}
    />
    <CardContent
      sx={{
        position: "absolute",
        inset: "auto 0 0 0",
        zIndex: 1,
      }}
    >
      <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.32em" }}>
        Coming Soon
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      <Chip
        label="Pre-register"
        sx={{
          borderRadius: 999,
          color: "#fff",
          backgroundColor: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      />
    </CardContent>
  </Card>
);

const TestimonialCard = ({ quote, name, role, avatar }) => (
  <Paper sx={{ ...cardSurface, p: 3 }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Avatar src={avatar} alt={name} sx={{ width: 52, height: 52 }} />
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.58)", letterSpacing: "0.24em", textTransform: "uppercase" }}>
          {role}
        </Typography>
      </Box>
    </Stack>
    <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, flexGrow: 1 }}>
      "{quote}"
    </Typography>
    <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
      {[...Array(5)].map((_, idx) => (
        <Star key={idx} size={16} fill="currentColor" color="#ffd54f" />
      ))}
    </Stack>
  </Paper>
);

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <Box sx={{ backgroundColor: "#050505", color: "#fff" }}>
      <Hero />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {HERO_STATS.map((stat) => (
            <Paper key={stat.label} sx={{ ...sectionSurface, p: 3.5 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff" }}>
                {stat.value}
              </Typography>
              <Typography
                variant="overline"
                sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.34em" }}
              >
                {stat.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper sx={{ ...sectionSurface, p: { xs: 3, md: 4 } }}>
          <SectionHeading
            eyebrow="Currently In Cinemas"
            title="Discover what's playing right now"
            description="Book seats for the hottest titles across Kathmandu, Pokhara, Lalitpur, and beyond."
            actionLabel="View all movies"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {CURRENTLY_IN_CINEMAS.map((movie) => (
              <MovieCard key={movie.title} {...movie} />
            ))}
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper sx={{ ...sectionSurface, p: { xs: 3, md: 4 } }}>
          <SectionHeading
            eyebrow="Top 10 Movies This Week"
            title="Get the critics' and audience favorites"
            description="These titles are trending and selling out fast. Grab a seat before it's gone."
            actionLabel="See showtimes"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {TOP_MOVIES.map((movie) => (
              <MovieCard key={movie.title} {...movie} />
            ))}
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper sx={{ ...sectionSurface, p: { xs: 3, md: 4 } }}>
          <SectionHeading
            eyebrow="Coming Soon"
            title="Plan for the next releases"
            description="Get ready for premieres and reserve before tickets drop."
            actionLabel="Pre-register"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {COMING_SOON.map((movie) => (
              <ComingSoonCard key={movie.title} {...movie} />
            ))}
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper
          sx={{
            ...sectionSurface,
            p: { xs: 3, md: 4 },
            background:
              "linear-gradient(135deg, rgba(31,31,34,0.98) 0%, rgba(10,10,10,0.98) 65%, rgba(78,13,17,0.92) 100%)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.36em" }}>
                Exclusive Offer
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Book tickets to your favorite movies online
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 560, lineHeight: 1.8 }}>
                Save time at the lobby, see seat availability, and access curated bundles created for the week.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/movies"
                  variant="contained"
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.4,
                    fontWeight: 800,
                    backgroundColor: "#e50914",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#c80811" },
                  }}
                >
                  Start booking
                </Button>
                <Button
                  component={RouterLink}
                  to="/locations"
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.4,
                    fontWeight: 800,
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.32)",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#e50914",
                      backgroundColor: "rgba(229,9,20,0.08)",
                    },
                  }}
                >
                  Explore halls
                </Button>
              </Stack>
            </Stack>

            <Paper
              sx={{
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.10)",
                p: 3,
                background:
                  "radial-gradient(circle at top, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 30%, rgba(0,0,0,0.2) 70%)",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 170,
                    height: 320,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background:
                      "linear-gradient(180deg, rgba(13,13,14,0.98) 0%, rgba(2,2,3,1) 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.38)",
                  }}
                />
                <Typography align="center" sx={{ color: "rgba(255,255,255,0.68)" }}>
                  Enjoy the Ticketor mobile experience with offline tickets, favorites, and push notifications.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: "100%" }}>
                  {APP_BADGES.map((badge) => (
                    <Button
                      key={badge.label}
                      fullWidth
                      startIcon={<Download size={16} />}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 4,
                        p: 1.5,
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.10)",
                        backgroundColor: "rgba(0,0,0,0.28)",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "rgba(229,9,20,0.45)",
                          backgroundColor: "rgba(229,9,20,0.10)",
                        },
                      }}
                    >
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{badge.label}</Typography>
                        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.58)" }}>
                          {badge.detail}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper sx={{ ...sectionSurface, p: { xs: 3, md: 4 } }}>
          <SectionHeading
            eyebrow="Happy Customers"
            title="Hear what movie lovers are saying"
            description="Verified reviews from people booking with Ticketor weekly."
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Paper sx={{ ...sectionSurface, p: { xs: 3, md: 4 } }}>
          <SectionHeading eyebrow="Frequently Asked Questions" title="Answers in seconds" />
          <Stack spacing={2}>
            {FAQS.map((item, index) => (
              <Accordion
                key={item.q}
                expanded={openFaq === index}
                onChange={(_, expanded) => setOpenFaq(expanded ? index : -1)}
                disableGutters
                sx={{
                  borderRadius: "24px !important",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(28,28,30,0.98) 0%, rgba(15,15,16,0.98) 100%)",
                  color: "#fff",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={18} color="#ffffff" />}
                  sx={{
                    px: 3,
                    py: 1,
                    "& .MuiAccordionSummary-content": { my: 1.2 },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, letterSpacing: "0.04em" }}>
                    {item.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Paper>
      </Container>

      <Container maxWidth="md" sx={{ pb: { xs: 7, md: 10 } }}>
        <Paper
          sx={{
            ...sectionSurface,
            p: { xs: 3, md: 5 },
            textAlign: "center",
            background:
              "linear-gradient(180deg, rgba(24,24,27,0.98) 0%, rgba(9,9,10,0.98) 70%, rgba(58,11,14,0.96) 100%)",
          }}
        >
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.42em" }}>
            Still have a question?
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            Ready to watch and book movies?
          </Typography>
          <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.68)" }}>
            Subscribe for early seat drops, reminder texts, and exclusive invites.
          </Typography>
          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 4,
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.18)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e50914",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: 4,
                minWidth: { sm: 170 },
                px: 3.5,
                py: 1.7,
                backgroundColor: "#e50914",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { backgroundColor: "#c80811" },
              }}
            >
              Sign up
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
