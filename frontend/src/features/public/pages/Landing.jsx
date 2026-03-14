import React, { useState } from "react";
import { Link } from "react-router-dom";
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
      "Dark mode, curated lists, and summary cards keep me looped into the week’s best titles.",
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

const SectionHeading = ({ eyebrow, title, description, actionLabel }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold">{title}</h2>
      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}
    </div>
    {actionLabel ? (
      <Link
        to="/movies"
        className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
      >
        {actionLabel} <ArrowRight size={16} />
      </Link>
    ) : null}
  </div>
);

const MovieCard = ({ image, title, genre, runtime, rating }) => (
  <article className="group flex flex-col overflow-hidden rounded-[26px] border border-white/5 bg-secondary shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:border-accent/40">
    <div
      className="h-64 w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url('${image}')` }}
      aria-label={`${title} poster`}
    />
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-text-secondary">
        <span>{genre}</span>
        <span className="flex items-center gap-1 text-yellow-400">
          <Star size={12} fill="currentColor" /> {rating}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {runtime ? (
        <p className="text-sm text-text-secondary">{runtime}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between text-sm text-text-secondary">
        <span className="rounded-full border border-white/10 px-3 py-1">
          Book now
        </span>
        <span className="text-accent">Showtimes →</span>
      </div>
    </div>
  </article>
);

const TestimonialCard = ({ quote, name, role, avatar }) => (
  <article className="flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-secondary p-6 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt={`${name} avatar`}
        className="h-12 w-12 rounded-full object-cover"
        loading="lazy"
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
          {role}
        </p>
      </div>
    </div>
    <p className="text-base leading-relaxed text-text-secondary">“{quote}”</p>
    <div className="flex items-center gap-1 text-yellow-400">
      {[...Array(5)].map((_, idx) => (
        <Star key={idx} size={14} fill="currentColor" />
      ))}
    </div>
  </article>
);

const ComingSoonCard = ({ title, image }) => (
  <article className="group relative h-72 overflow-hidden rounded-3xl border border-white/5 bg-secondary shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:border-accent/50">
    <div
      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url('${image}')` }}
      aria-label={`${title} preview`}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/0" />
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">Coming soon</p>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <span className="rounded-full border border-white/30 px-3 py-1 text-xs">
        Pre-register
      </span>
    </div>
  </article>
);

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-primary text-text-primary">
      <Hero />
      <section className="border-b border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-black/60 px-6 py-5 text-left"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Currently In Cinemas"
            title="Discover what's playing right now"
            description="Book seats for the hottest titles across Kathmandu, Pokhara, Lalitpur, and beyond."
            actionLabel="View all movies"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {CURRENTLY_IN_CINEMAS.map((movie) => (
              <MovieCard key={movie.title} {...movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Top 10 Movies This Week"
            title="Get the critics' and audience favorites"
            description="These titles are trending and selling out fast—grab a seat before it's gone."
            actionLabel="See showtimes"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOP_MOVIES.map((movie) => (
              <MovieCard key={movie.title} {...movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Coming Soon"
            title="Plan for the next releases"
            description="Get ready for premieres and reserve before tickets drop."
            actionLabel="Pre-register"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMING_SOON.map((movie) => (
              <ComingSoonCard key={movie.title} {...movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#121212] to-[#050505] p-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
                Exclusive Offer
              </p>
              <h3 className="text-3xl font-bold">Book tickets to your favorite movies online</h3>
              <p className="text-sm text-text-secondary">
                Save time at the lobby, see seat availability, and access curated bundles created for the week.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/movies"
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-accent/90"
                >
                  Start booking
                </Link>
                <Link
                  to="/locations"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-accent hover:text-white"
                >
                  Explore halls
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_45%)]" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                <div className="h-64 w-40 rounded-[38px] border border-white/20 bg-gradient-to-b from-[#0b0b0b] to-[#030303]" />
                <p className="text-center text-sm text-text-secondary">
                  Enjoy the Ticketor mobile experience with offline tickets, favorites, and push notifications.
                </p>
                <div className="flex w-full flex-wrap justify-center gap-3">
                  {APP_BADGES.map((badge) => (
                    <button
                      key={badge.label}
                      type="button"
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent"
                    >
                      <Download size={16} />
                      <span className="text-left">
                        <strong className="block text-[11px]">{badge.label}</strong>
                        <span className="text-[10px] text-text-secondary">{badge.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Happy Customers"
            title="Hear what movie lovers are saying"
            description="Verified reviews from people booking with Ticketor weekly."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Answers in seconds"
          />
          <div className="space-y-4">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article
                  key={item.q}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-secondary"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary"
                  >
                    {item.q}
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-6 text-base text-text-primary">
                      {item.a}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-text-secondary">
            Still have a question?
          </p>
          <h2 className="text-3xl font-black">Ready to watch & book movies?</h2>
          <p className="text-sm text-text-secondary">
            Subscribe for early seat drops, reminder texts, and exclusive invites.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-accent/90"
            >
              Sign up
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
