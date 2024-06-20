const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('/Users/chgakreesh/Desktop/React/Malladi-site-main 2/CSV1.py');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post('/run-csv-script', (req, res) => {
    const { startDateTime, endDateTime } = req.body;

    const pythonProcess = spawn('python3', ['CSV.py', startDateTime, endDateTime]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);

        // Assuming the script generates a CSV file named "filtered_output.csv" in the current directory
        const filePath = path.join(__dirname, 'filtered_output.csv');
        res.download(filePath, 'filtered_output.csv', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to download the file');
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
