const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run", (req, res) => {
    const { code, language, input } = req.body;
    if (!code || !language) return res.status(400).json({ error: "Kod va til kerak" });

    let process;
    if (language === "python") {
        process = spawn("python3", ["-c", code]);
    } else if (language === "javascript") {
        process = spawn("node", ["-e", code]);
    } else {
        return res.status(400).json({ error: "Notogri dasturlash tili" });
    }

    process.stdin.write(input + "\n");
    process.stdin.end();

    let output = "";
    let error = "";

    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (data) => (error += data.toString()));

    process.on("close", () => {
        res.json({ output: output.trim(), error: error.trim() });
    });
});

app.listen(5000, () => console.log("Server 5000-portda ishlayapti"));
