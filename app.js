const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const indexRouter = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'ძალიან ბევრი მოთხოვნა, სცადეთ მოგვიანებით' },
});
app.use('/api', limiter);

app.use('/', indexRouter);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'სერვერი მუშაობს' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
