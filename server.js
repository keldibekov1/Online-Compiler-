const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/run", (req, res) => {
    const { code, language, input } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Kod va dasturlash tili kerak." });
    }

    let process;

    if (language === "python") {
        process = spawn("python3", ["-c", code]);
    } else if (language === "javascript") {
        process = spawn("node", ["-e", code]);
    } else {
        return res.status(400).json({ error: "Noto‘g‘ri dasturlash tili." });
    }
    if (input) {
        process.stdin.write(input + "\n");
    }
    process.stdin.end();

    let output = "";
    let error = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        error += data.toString();
    });

    process.on("close", (code) => {
        res.json({ output: output.trim(), error: error.trim(), exitCode: code });
    });

    process.on("error", (err) => {
        res.status(500).json({ error: "Ishga tushirishda xatolik: " + err.message });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT}-portda ishlayapti`);
});
