const notFound = (req, res, next) => {
  const error = new Error(`გვერდი ვერ მოიძებნა - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'რესურსი ვერ მოიძებნა (არასწორი ID ფორმატი)';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'ეს მნიშვნელობა უკვე გამოყენებულია (დუბლირება)';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
