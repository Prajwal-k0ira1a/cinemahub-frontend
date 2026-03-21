import React, { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  ShieldCheck,
  Smartphone,
  Ticket,
  Wallet,
  X,
} from "lucide-react";

const SEAT_COLORS = {
  regular: "text-[#ece8dc]",
  premium: "text-sky-300",
  sold: "text-[#56556f]",
  locked: "text-slate-500",
  selected: "text-[#e50914]",
};

const panelClass =
  "rounded-lg border border-white/10 bg-[#0f1119]/95 shadow-[0_18px_42px_rgba(0,0,0,0.32)] backdrop-blur-sm";

const PAYMENT_METHODS = [
  {
    id: "esewa",
    title: "eSewa",
    subtitle: "Secure redirect payment",
    icon: Wallet,
    enabled: true,
  },
  {
    id: "card",
    title: "Card",
    subtitle: "Coming soon",
    icon: CreditCard,
    enabled: false,
  },
  {
    id: "wallet",
    title: "Cinema Wallet",
    subtitle: "Coming soon",
    icon: Smartphone,
    enabled: false,
  },
];

export default function BookingPanel({
  bookingOpen,
  movie,
  selectedShowtime,
  genreLabel,
  uniqueDates,
  showtimes,
  seatRows,
  selectedSeatIds,
  heldSeatIds,
  selectedSeatLabels,
  bookingLoading,
  selectedSeatCount,
  seatHoldSecondsLeft,
  ticketTotal,
  bookingSubmitting,
  onToggleSeatSelection,
  onOpenBooking,
  onSelectBookingDate,
  onSubmitBooking,
  onClose,
  getPosterUrl,
  formatDuration,
  formatTime,
  prettyDateChip,
  toDateKey,
  formatCurrency,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("esewa");

  useEffect(() => {
    if (bookingOpen) {
      setActiveStep(0);
      setSelectedPayment("esewa");
    }
  }, [bookingOpen, selectedShowtime?.id]);

  const holdMinutes = String(Math.floor((seatHoldSecondsLeft || 0) / 60)).padStart(2, "0");
  const holdSeconds = String((seatHoldSecondsLeft || 0) % 60).padStart(2, "0");
  const holdLabel = selectedSeatCount > 0 ? `${holdMinutes}:${holdSeconds}` : "--:--";
  const activeDateKey = toDateKey(selectedShowtime?.show_date);

  const matchingShowtimes = useMemo(
    () =>
      showtimes.filter(
        (item) =>
          Number(item.hallroom_id) === Number(selectedShowtime?.hallroom_id) &&
          toDateKey(item.show_date) === activeDateKey,
      ),
    [activeDateKey, selectedShowtime?.hallroom_id, showtimes, toDateKey],
  );

  const selectedSeatObjects = useMemo(
    () =>
      seatRows
        .flatMap((row) => row.seats)
        .filter((seat) => seat?.type === "seat" && selectedSeatIds.includes(seat.id)),
    [seatRows, selectedSeatIds],
  );

  const regularSeatCount = selectedSeatObjects.filter((seat) => seat.seatType !== "premium").length;
  const premiumSeatCount = selectedSeatObjects.filter((seat) => seat.seatType === "premium").length;

  const selectedSessionLabel = selectedShowtime
    ? `${prettyDateChip(activeDateKey)} • ${formatTime(selectedShowtime.start_time)}`
    : "Pick a showtime";

  const summaryRows = [
    { label: "Ticket type", value: selectedSeatCount > 0 ? `${selectedSeatCount} selected` : "None" },
    { label: "Session", value: formatTime(selectedShowtime?.start_time) || "--:--" },
    { label: "Payment", value: selectedPayment === "esewa" ? "eSewa" : "Not selected" },
  ];

  const canGoPayment = selectedSeatCount > 0;
  const canConfirm = selectedSeatCount > 0 && selectedPayment === "esewa";

  if (!bookingOpen) return null;

  const handleNext = () => {
    if (activeStep === 0) {
      if (!canGoPayment) return;
      setActiveStep(1);
      return;
    }

    if (activeStep === 1) {
      if (!canConfirm) return;
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const renderStepHeader = () => (
    <div className="flex items-center justify-between gap-4">
      {["Seat", "Payment", "Ticket"].map((label, index) => {
        const active = index === activeStep;
        const complete = index < activeStep;
        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex flex-col gap-2">
              <span className={`text-sm font-semibold ${active ? "text-white" : "text-white/60"}`}>{label}</span>
              <span
                className={`h-5 w-5 rounded-full border ${
                  active
                    ? "border-[#e50914] bg-[#e50914]"
                    : complete
                      ? "border-[#e50914]/40 bg-[#e50914]/15"
                      : "border-white/20 bg-[#2c2e3a]"
                }`}
              />
            </div>
            {index < 2 ? <div className="mt-6 h-px flex-1 bg-white/15" /> : null}
          </div>
        );
      })}
    </div>
  );

  const renderSeatGrid = () => (
    <div className="mt-6 overflow-x-auto">
      <div className="mx-auto min-w-max space-y-3">
        {seatRows.map((row) => (
          <div key={row.rowNumber} className="flex items-center justify-center gap-3">
            <div className="w-5 text-right text-xl font-semibold text-white/85">{row.rowLabel}</div>
            <div className="flex items-center gap-1.5">
              {row.seats.map((seat) => {
                if (seat.type === "gap") {
                  return <span key={seat.id} className="h-7 w-7" />;
                }

                const isSelected = selectedSeatIds.includes(seat.id);
                const isBooked = Boolean(seat.isBooked);
                const isHeld = heldSeatIds.includes(Number(seat.id));
                const seatColorClass = isBooked
                  ? SEAT_COLORS.sold
                  : isHeld
                    ? SEAT_COLORS.locked
                    : isSelected
                      ? SEAT_COLORS.selected
                      : seat.seatType === "premium"
                        ? SEAT_COLORS.premium
                        : SEAT_COLORS.regular;

                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => onToggleSeatSelection(seat)}
                    disabled={isBooked || isHeld}
                    title={seat.seat_number}
                    className={`grid h-8 w-8 place-items-center rounded-md border transition ${
                      isSelected
                        ? "border-[#e50914]/60 bg-[#e50914]/10"
                        : "border-white/10 bg-transparent"
                    } ${
                      isBooked || isHeld
                        ? "cursor-not-allowed opacity-80"
                        : "hover:-translate-y-0.5 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Armchair size={18} className={seatColorClass} />
                  </button>
                );
              })}
            </div>
            <div className="w-5 text-left text-xl font-semibold text-white/85">{row.rowLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSeatStep = () => (
    <>
      <div className="relative mx-auto mt-6 h-24 w-full max-w-3xl overflow-visible">
        <div className="absolute left-1/2 top-0 h-[72px] w-[78%] -translate-x-1/2">
          <div className="h-full w-full [clip-path:polygon(10%_0,90%_0,80%_100%,20%_100%)] bg-[#616077]" />
          <div className="absolute inset-0 flex items-center justify-center text-lg text-white/60">Stage</div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[70px] h-14 w-[60%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      {bookingLoading ? (
        <div className="mt-8 rounded-md border border-white/10 bg-black/20 p-8 text-center text-sm text-slate-300">
          Loading seats...
        </div>
      ) : (
        <>
          {renderSeatGrid()}

          <div className="mt-6 flex flex-col gap-4 rounded-md border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <Ticket size={16} className="text-[#e50914]" />
                <span>{selectedSeatCount} Selected Seats</span>
              </div>
              <p className="text-sm text-white/60">{selectedSeatLabels || "No seats selected"}</p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-white/70">
              <div className="flex items-center gap-2"><Armchair size={16} className={SEAT_COLORS.regular} />Available</div>
              <div className="flex items-center gap-2"><Armchair size={16} className={SEAT_COLORS.premium} />Premium</div>
              <div className="flex items-center gap-2"><Armchair size={16} className={SEAT_COLORS.locked} />Reserved</div>
              <div className="flex items-center gap-2"><Armchair size={16} className={SEAT_COLORS.selected} />Selected</div>
              <div className="flex items-center gap-2"><Armchair size={16} className={SEAT_COLORS.sold} />Unavailable</div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div>
        <p className="text-xl font-semibold text-white">Choose payment method</p>
        <p className="mt-1 text-sm text-white/55">Select the payment option you want to continue with.</p>
      </div>

      {PAYMENT_METHODS.map((method) => {
        const Icon = method.icon;
        const active = selectedPayment === method.id;
        return (
          <button
            key={method.id}
            type="button"
            disabled={!method.enabled}
            onClick={() => method.enabled && setSelectedPayment(method.id)}
            className={`flex w-full items-center justify-between rounded-md border p-4 text-left transition ${
              active
                ? "border-[#e50914]/35 bg-[#e50914]/10"
                : "border-white/10 bg-white/[0.02]"
            } ${method.enabled ? "hover:bg-white/[0.04]" : "cursor-not-allowed opacity-60"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-md ${active ? "bg-[#e50914]/15 text-[#e50914]" : "bg-white/[0.04] text-white/70"}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-white">{method.title}</p>
                <p className="mt-1 text-sm text-white/55">{method.subtitle}</p>
              </div>
            </div>
            <div className={`h-4 w-4 rounded-full border ${active ? "border-[#e50914] bg-[#e50914]" : "border-white/20 bg-transparent"}`} />
          </button>
        );
      })}

      <div className="rounded-md border border-sky-400/15 bg-sky-400/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-sky-300" />
          <div>
            <p className="font-medium text-white">Secure payment</p>
            <p className="mt-1 text-sm text-white/65">
              Your selected seats and booking details are preserved while you complete payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-5">
      <div>
        <p className="text-xl font-semibold text-white">Review booking</p>
        <p className="mt-1 text-sm text-white/55">Confirm your seats and continue to create the booking.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-white/45">Session details</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Movie</span>
              <span className="font-medium text-white">{movie?.movie_title || "Movie"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Venue</span>
              <span className="font-medium text-white">{selectedShowtime?.Hallroom?.Hall?.hall_name || "Cinema Hall"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Date & Time</span>
              <span className="font-medium text-white">{selectedSessionLabel}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-[#e50914]/20 bg-[#e50914]/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-white/45">Payment summary</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Selected seats</span>
              <span className="font-medium text-white">{selectedSeatLabels || "None"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Method</span>
              <span className="font-medium text-white">{selectedPayment === "esewa" ? "eSewa" : "Not selected"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/55">Total payment</span>
              <span className="text-lg font-semibold text-white">{formatCurrency(ticketTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainStep = () => {
    if (activeStep === 1) return renderPaymentStep();
    if (activeStep === 2) return renderReviewStep();
    return renderSeatStep();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b10]/92 backdrop-blur-sm">
      <div className="h-full overflow-y-auto px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className={`${panelClass} overflow-hidden`}>
            <div className="border-b border-white/10 px-4 py-5 md:px-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#e50914] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                        Booking
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {genreLabel}
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {formatDuration(movie?.duration)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {movie?.movie_title || "Movie Booking"}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">
                      Select seats, choose payment, and confirm your ticket in a focused flow.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="self-start rounded-md border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div>{renderStepHeader()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-4 md:p-6 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
              <aside className="space-y-4">
                <div className={panelClass}>
                  <div className="p-4">
                    <img
                      src={getPosterUrl(movie?.moviePoster)}
                      alt={movie?.movie_title || "Movie"}
                      className="h-64 w-full rounded-md object-cover"
                    />

                    <div className="mt-4">
                      <p className="text-lg font-semibold text-white">
                        {selectedShowtime?.Hallroom?.Hall?.hall_name || "Cinema Hall"}
                      </p>
                      <div className="mt-2 flex items-start gap-2 text-sm text-white/65">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span>{selectedShowtime?.Hallroom?.Hall?.hall_location || "Location unavailable"}</span>
                      </div>
                    </div>

                    <div className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start gap-2 text-sm text-white/75">
                        <CalendarDays size={15} className="mt-0.5 shrink-0 text-[#e50914]" />
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Session</p>
                          <p className="mt-1 font-medium text-white">{selectedSessionLabel}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-start gap-2 text-sm text-white/75">
                        <Clock3 size={15} className="mt-0.5 shrink-0 text-[#e50914]" />
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Seat hold</p>
                          <p className="mt-1 font-medium text-white">{holdLabel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-white">Choose date</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uniqueDates.slice(0, 6).map((dateKey) => {
                          const active = activeDateKey === dateKey;
                          return (
                            <button
                              key={dateKey}
                              type="button"
                              onClick={() => onSelectBookingDate?.(dateKey)}
                              className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                                active
                                  ? "bg-[#e50914] text-white"
                                  : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
                              }`}
                            >
                              {prettyDateChip(dateKey)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-white">Showtimes</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {matchingShowtimes.map((time) => {
                          const active = Number(time.id) === Number(selectedShowtime?.id);
                          return (
                            <button
                              key={time.id}
                              type="button"
                              onClick={() => onOpenBooking(time.id)}
                              className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                                active
                                  ? "bg-[#f4f4f5] text-black"
                                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                              }`}
                            >
                              {formatTime(time.start_time)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <section className={panelClass}>
                <div className="p-4 md:p-5">{renderMainStep()}</div>
              </section>

              <aside className={panelClass}>
                <div className="p-4">
                  <p className="text-lg font-semibold text-white">Selected Seats</p>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-md border border-white/10 p-4">
                      <div className="flex items-center justify-between text-base text-white">
                        <span>Regular $300</span>
                        <span>{regularSeatCount}</span>
                      </div>
                    </div>
                    <div className="rounded-md border border-white/10 p-4">
                      <div className="flex items-center justify-between text-base text-white">
                        <span>Premium $500</span>
                        <span>{premiumSeatCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/45">Selected seat numbers</p>
                    <p className="mt-2 text-sm text-white/85">{selectedSeatLabels || "None"}</p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {summaryRows.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-white/55">{item.label}</span>
                        <span className="font-medium text-white/90">{item.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex items-center justify-between text-base">
                        <span className="text-white/55">Total Payment:</span>
                        <span className="text-2xl font-semibold text-white">{formatCurrency(ticketTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    {activeStep > 0 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="h-12 w-full rounded-md border border-white/10 bg-transparent text-sm font-semibold text-white/70 transition hover:bg-white/5"
                      >
                        Back
                      </button>
                    ) : null}

                    {activeStep < 2 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={(activeStep === 0 && !canGoPayment) || (activeStep === 1 && !canConfirm)}
                        className="h-12 w-full rounded-md bg-[#e50914] text-base font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activeStep === 0 ? "Add to Cart" : "Continue"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onSubmitBooking}
                        disabled={bookingSubmitting || !canConfirm}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#e50914] text-base font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {bookingSubmitting ? "Generating Ticket..." : "Confirm Booking"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="h-12 w-full rounded-md border border-white/20 bg-transparent text-base font-semibold text-white transition hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
