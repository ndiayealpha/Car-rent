const { constants } = require('../constants');
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.NOT_AUTHORIZED:
      res.json({
        title: 'Not Authorized',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDEN:
      res.json({
        title: 'Access no authorisé',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: 'NOT FOUND',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: 'SERVER ERROR',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.BAD_REQUEST:
      res.json({
        title: 'BAD REQUEST',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
        case constants.SERVER_ERROR:
            res.json({
              title: 'SERVER ERROR',
              message: err.message,
              stackTrace: err.stack,
            });
            break;
  }
};

module.exports = errorHandler;
