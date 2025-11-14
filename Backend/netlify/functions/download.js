import fs from "fs";
import path from "path";

const logPath = path.resolve("logs", "download-history.json");


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
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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
