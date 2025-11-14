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
  

export const handler = async () => {
  const history = load(logPath);

  return {
    statusCode: 200,
    body: JSON.stringify(history)
  };
};
