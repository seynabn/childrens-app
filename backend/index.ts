import { startServer } from "./src/server";

startServer().catch((error) => {
  console.error(error instanceof Error ? error.message : "Server startup failed");
  process.exitCode = 1;
});
