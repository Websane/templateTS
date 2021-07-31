const { createProxyMiddleware } = require('http-proxy-middleware');

const contextProxy = ''; // запросы, начинающиеся с указанной строки будут проксироваться, например '/api'
const targetUrl = ''; // адрес, куда будут проксироваться запросы, например 'https://turkeymed.zerolab.dev'

module.exports = (app) => {
  app.use(createProxyMiddleware (contextProxy, { target: targetUrl, changeOrigin: true }));
};
