const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

let data = [];

app.use(express.json());
app.use(cors());
app.get('/api', (req, res) => {
    const path = `/api/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
  });

app.post('/api/files', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (!fs.existsSync(req.file.path)) {
            return res.status(500).json({ message: 'File not found' });
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        const rows = fileContent.split('\n').map(line => line.split(','));

        data = rows.slice(1);

        fs.unlinkSync(req.file.path);
        res.status(200).json({ message: 'The file was uploaded successfully' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'File processing error' });
    }
});

app.get('/api/users', (req, res) => {
    try {
        const query = req.query.q.toLowerCase();
        const filteredData = data.filter(item =>
            Object.values(item).some(value =>
                value.toLowerCase().includes(query)
            )
        );
        res.status(200).json({ data: filteredData });
    } catch (error) {
        console.error('Error filtering data:', error);
        res.status(500).json({ message: 'Error filtering' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;