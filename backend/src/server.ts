import express from 'express';
import path from 'path';
import cors from 'cors';

import 'express-async-errors';
import 'dotenv/config';

import './database/connection';

import routes from './routes';

const app = express();

app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(3333);