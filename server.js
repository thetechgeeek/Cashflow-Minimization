import express from 'express';
const app = new express();
app.use(express.static('.'));
app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: '.' });
});

app.listen(process.env.PORT, console.log('Server running on port 5000.'));
