import React from "react";
import Movies from "../../../shared/components/Movies.jsx";

const MoviesPage = () => {
  return (
    <div className="pb-10 pt-20 sm:pb-12 sm:pt-24">
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden border border-white/10 bg-secondary p-5 sm:p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.18),transparent_45%)]" />
          <div className="relative">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
              Movies
            </p>
            <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl md:text-5xl">All Movies</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary md:text-base">
              Discover what is playing now and what is coming next. Open any movie to view full details and showtime context.
            </p>
          </div>
        </div>
      </section>
      <Movies />
    </div>
  );
};

export default MoviesPage;
