import app from "./app";
import { logger } from "./lib/logger";
import { ensureDbExtensions } from "./lib/bootstrap";
import { startScheduledJobs, runStartupBackfills } from "./jobs";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Bind the port FIRST — liveness must never depend on DB reachability or latency.
// Ensuring extensions before listen could delay (or, historically, abort) the
// port opening when the DB is briefly unready at boot, failing the deploy
// healthcheck ("port never opened"). We listen immediately, then ensure
// extensions in the background (non-fatal + self-logged); trigram features
// degrade gracefully until the DB/extension is available. Readiness (DB up) is
// reported separately by /readyz.
app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  void ensureDbExtensions();
  startScheduledJobs();
  void runStartupBackfills();
});
