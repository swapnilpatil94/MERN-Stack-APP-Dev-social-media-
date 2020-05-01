const express = require('express');
const app = express();
const connectDB = require('./config/db')

// Connect Database
connectDB();

// Init Middleware 
app.use(express.json({
    extended: false
}))

app.get('/', (req, res) => {
    res.send("MERN stack app for developers")
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));




// Server Running 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });

