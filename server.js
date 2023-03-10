const express = require('express');
const cors = require('cors');
const fs = require('fs');

const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'test') {
  dbUri = 'mongodb://localhost:27017/backendWorkshopsTest';
} else {
  dbUri = `mongodb+srv://Admin:${process.env.DB_PASS}@cluster0.c6cj6je.mongodb.net/backendWorkshops?retryWrites=true&w=majority`;
}

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );
}
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: dbUri,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      collectionName: 'sessions',
      cookie: {
        secure: process.env.NODE_ENV == 'production',
      },
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', adsRoutes);
app.use('/api/auth', authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

mongoose.set('strictQuery', false);

db.once('open', () => {
  console.log('Connected to the database');
});

db.on('error', (err) => console.log('Error' + err));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

module.exports = server;
