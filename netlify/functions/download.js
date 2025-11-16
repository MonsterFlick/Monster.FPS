import fs from "fs";
import path from "path";
import os from "os";

// Prefer the project `logs/` folder when running locally (writable),
// but serverless environments have a read-only bundle. Fall back to
// the runtime temp directory (usually `/tmp`) when needed.
const origLogPath = path.resolve("logs", "download-history.json");
let logPath;
try {
  // Ensure the logs dir exists and is writable
  fs.mkdirSync(path.dirname(origLogPath), { recursive: true });
  fs.accessSync(path.dirname(origLogPath), fs.constants.W_OK);
  logPath = origLogPath;
} catch (err) {
  const tmpLogsDir = path.join(os.tmpdir(), "monster-fps-logs");
  try {
    fs.mkdirSync(tmpLogsDir, { recursive: true });
  } catch (e) {
    // ignore
  }
  logPath = path.join(tmpLogsDir, "download-history.json");
}


function load(file) {
    try {
      if (!fs.existsSync(file)) return [];
      const raw = fs.readFileSync(file, "utf-8").trim();
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  

function save(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    // Don't let logging failures break the download response in production.
    console.warn("Failed to write download history:", err && err.message);
  }
}

export const handler = async (event, context) => {
  const url = event.path;
  const filename = url.split("/").pop();
  const filePath = path.resolve("public", "files", filename);

  if (!fs.existsSync(filePath)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "File not found" })
    };
  }

  const user = event.headers["x-forwarded-for"] || "unknown";


  const fileBuffer = fs.readFileSync(filePath);

  // Log
  const history = load(logPath);
  history.push({
    user,
    filename,
    timestamp: new Date().toISOString()
  });
  save(logPath, history);

  return {  
    statusCode: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`
    },
    body: fileBuffer.toString("base64"),
    isBase64Encoded: true
  };
};
