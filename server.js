const http = require("http");
const fs = require("fs");
const url = require("url");
require("dotenv").config();

const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";

http
  .createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const filePath = queryObject.filePath;

    if (!filePath) {
      res.writeHead(400, {
        "Content-Type": "text/html",
      });
      res.end("Errore nella lettura del file. Assicurati che il percorso del file sia corretto.");
      return;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");

      const wordCount = content.split(/\s+/).length;
      const letterCount = content.replace(/\s+/g, "").length;
      const spaceCount = (content.match(/\s/g) || []).length;

      const wordMap = {};
      const words = content.toLowerCase().match(/\b\w+\b/g) || [];

      words.forEach((word) => {
        wordMap[word] = (wordMap[word] || 0) + 1;
      });

      const frequentWords = Object.fromEntries(Object.entries(wordMap).filter(([_, count]) => count > 10));

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          wordCount,
          letterCount,
          spaceCount,
          frequentWords,
        })
      );
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "text/html",
      });
      res.end("Errore nella lettura de file, assicurrati che il file path sia corretto.");
    }
  })
  .listen(port, host, () => {
    const serverUrl = `http://${host}:${port}`;
    console.log(`Server avviato su ${serverUrl}`);
  });
