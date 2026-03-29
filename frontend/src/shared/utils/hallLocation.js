export const HALL_LOCATION_MAX_LENGTH = 250;

export const normalizeHallLocation = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, HALL_LOCATION_MAX_LENGTH);
