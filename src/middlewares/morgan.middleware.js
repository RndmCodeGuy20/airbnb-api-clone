import morgan from 'morgan';
import { logger } from '#helpers/index';

export const morganMiddleware = morgan(
    function(tokens, req, res) {
      return JSON.stringify({
        httpVersion: tokens['http-version'](req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res)),
        content_length: tokens.res(req, res, 'content-length'),
        response_time: Number.parseFloat(tokens['response-time'](req, res)),
        remote_address: tokens['remote-addr'](req, res),
        total_time: Number.parseFloat(tokens['total-time'](req, res)),
      });
    },
    {
      stream: {
        write: (message) => {
          const data = JSON.parse(message);
          logger.http(
              // eslint-disable-next-line max-len
              `${data.httpVersion} ${data.method} ${data.url} ${data.status} ${data.response_time}ms                ${data.content_length} ${data.remote_address} ${data.total_time}ms`,
              { label: 'API' },
          );
        },
      },
    },
);
