const express = require('express');
const app = express();

app.use(express.static('dist'));

const port = process.env.SERVER_PORT || 8081;
app.listen(port, _ => console.log(`Server started on port ${port}`));