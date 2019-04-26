const proxy = require("http-proxy-middleware");
const { ENV_HOST } = process.env;

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: ENV_HOST || "http://localhost:5000/",
      logLevel: "debug",
      changeOrigin: true,
      proxyTimeout: 20 * 60 * 1000,
      pathRewrite: { "^/api": "" },
      timeout: 20 * 60 * 1000
    })
  );
};
