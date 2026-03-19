import React from "react";
import { Box, Card, CardContent, CardHeader, Container, Divider, LinearProgress, Stack, Typography,Grid } from "@mui/material";
import { Film, MapPin, Ticket, Users } from "lucide-react";

const SparkLine = ({ data, height = 48, stroke = "#e50914", fill = "rgba(229,9,20,0.12)" }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 140;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} role="img" aria-label="sparkline">
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={fill}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StatCard = ({ title, value, delta, icon, color }) => (
  <Card
    variant="outlined"
    sx={{
      flex: "1 1 220px",
      minWidth: 0,
      borderRadius: 2,
      height: "100%",
      borderColor: color || "rgba(255,255,255,0.08)",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
      }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
        {delta !== undefined && (
          <Typography variant="caption" color={delta >= 0 ? "success.main" : "error.main"}>
            {delta >= 0 ? "+" : ""}
            {delta}% vs last week
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1.5,
          bgcolor: color || "rgba(255,255,255,0.04)",
          display: "grid",
          placeItems: "center",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Static placeholders; wire to real metrics when available.
  const stats = [
    { title: "Total Movies", value: "24", delta: 3, icon: <Film size={18} />, color: "rgba(229,9,20,0.35)" },
    { title: "Active Halls", value: "12", delta: 0, icon: <MapPin size={18} />, color: "rgba(16,185,129,0.35)" },
    { title: "Total Users", value: "1,234", delta: 4, icon: <Users size={18} />, color: "rgba(59,130,246,0.35)" },
    { title: "Tickets Sold", value: "856", delta: -2, icon: <Ticket size={18} />, color: "rgba(255,159,64,0.35)" },
  ];

  const revenueSeries = [42, 48, 51, 58, 63, 70, 66];
  const ticketsSeries = [120, 132, 140, 160, 155, 168, 180];

  return (
    <Container maxWidth="lg" sx={{ px: 0 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Use Form Applications to review hall registrations; manage movies, halls, and showtimes from the side menu.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </Stack>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardHeader
            title={<Typography variant="h6" fontWeight={700}>At a glance</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">Recent activity snapshot</Typography>}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Weekly Revenue (k USD)
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>$70k</Typography>
                    <Typography variant="caption" color="success.main">+8% vs last week</Typography>
                  </Box>
                  <SparkLine data={revenueSeries} />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Seat occupancy (this week)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={72}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": { backgroundColor: "primary.main" },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    72% average load across showtimes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tickets Sold (weekly)
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>180</Typography>
                    <Typography variant="caption" color="success.main">+12% vs last week</Typography>
                  </Box>
                  <SparkLine data={ticketsSeries} stroke="#10b981" fill="rgba(16,185,129,0.12)" />
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Application review progress
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Pending</Typography>
                      <Typography variant="caption">8</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={35} sx={{ height: 8, borderRadius: 4 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Approved</Typography>
                      <Typography variant="caption">18</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4 }} />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Dashboard;
