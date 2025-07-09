const express = require("express")
const { errorHandler } = require("./middleware/errorHandler")

// Import routes
const authRoutes = require("./routes/auth")
const playerRoutes = require("./routes/player")
const realmRoutes = require("./routes/realms")
const battleRoutes = require("./routes/battle")
const inventoryRoutes = require("./routes/inventory")
const marketplaceRoutes = require("./routes/marketplace")
const adminRoutes = require("./routes/admin")

const app = express()

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Palace of Quests API",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/player", playerRoutes)
app.use("/api/realms", realmRoutes)
app.use("/api/battle", battleRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/marketplace", marketplaceRoutes)
app.use("/api/admin", adminRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  })
})

// Global error handler
app.use(errorHandler)

module.exports = app
