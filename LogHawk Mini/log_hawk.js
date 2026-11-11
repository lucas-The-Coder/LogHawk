const fs = require("fs");

function parseLogLine(line) {
  if (typeof line !== "string" || line.trim() === "") {
    return null;
  }

  const regex =
    /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(FAILED|SUCCESS)\s+(\d+\.\d+\.\d+\.\d+)$/;
  const match = line.trim().match(regex);

  if (!match) {
    return null;
  }

  const timestamp = match[1];
  const status = match[2];
  const ip = match[3];

  const date = new Date(timestamp.replace(/\s+/, "T"));
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    timestamp,
    status,
    ip,
  };
}

function countFailures(attempts) {
  const failures = new Map();

  for (const attempt of attempts) {
    if (attempt.status !== "FAILED") {
      continue;
    }

    if (failures.has(attempt.ip)) {
      failures.set(attempt.ip, failures.get(attempt.ip) + 1);
    } else {
      failures.set(attempt.ip, 1);
    }
  }

  return failures;
}

function detectBruteForce(failures, threshold) {
  const findings = [];

  for (const [ip, count] of failures.entries()) {
    if (count >= threshold) {
      findings.push({ ip, count });
    }
  }

  return findings;
}

function main() {
  const logFilePath = process.argv[2] || "sample_auth.log";

  let fileContent;
  try {
    fileContent = fs.readFileSync(logFilePath, "utf8");
  } catch (err) {
    console.error(`Error reading log file "${logFilePath}": ${err.message}`);
    return;
  }

  const lines = fileContent.split(/\r?\n/);
  const attempts = [];

  for (const line of lines) {
    const attempt = parseLogLine(line);
    if (attempt !== null) {
      attempts.push(attempt);
    }
  }

  const failures = countFailures(attempts);
  const findings = detectBruteForce(failures, 5);

  if (findings.length === 0) {
    console.log("CLEAN");
  } else {
    for (const finding of findings) {
      console.log(
        `BRUTE FORCE DETECTED: IP=${finding.ip}, Failures=${finding.count}`,
      );
    }
  }

  try {
    fs.writeFileSync("alerts.json", JSON.stringify(findings, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing alerts.json: ${err.message}`);
    return;
  }

  return;
}

main();
