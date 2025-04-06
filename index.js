const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const connectDB = require('./src/config/db');
const routes = require('./src/routes/index'); 
require('dotenv').config();

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views')); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, Go to http://localhost:${PORT}/login`);
});
