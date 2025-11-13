import app, { prisma } from "./app";

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST as any, async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connection established");
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  HeliosHash DAO Backend API Server                            ║
╚════════════════════════════════════════════════════════════════╝

✓ Server running on http://${HOST}:${PORT}
✓ Environment: ${process.env.NODE_ENV || "development"}
✓ Database: Connected

API Endpoints:
  • Health Check:       GET http://${HOST}:${PORT}/health
  • API Info:           GET http://${HOST}:${PORT}/api/v1/info
  
Auth Endpoints:
  • Register:           POST http://${HOST}:${PORT}/api/v1/auth/register
  • Login:              POST http://${HOST}:${PORT}/api/v1/auth/login
  • Refresh Token:      POST http://${HOST}:${PORT}/api/v1/auth/refresh
  
User Endpoints:
  • Get Profile:        GET http://${HOST}:${PORT}/api/v1/users/:id
  • Update Profile:     PUT http://${HOST}:${PORT}/api/v1/users/:id
  • Get Balance:        GET http://${HOST}:${PORT}/api/v1/users/:id/balance

═════════════════════════════════════════════════════════════════

Press Ctrl+C to stop
  `);
});

export default server;
