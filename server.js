const express = require("express");
const path = require("path");
const proxy = require("http-proxy-middleware");
const app = express();
const { ENV_HOST, NODE_PORT } = process.env;

app.use(express.static(path.join(__dirname, "build")));

app.use(
  proxy("/api", {
    target: ENV_HOST || "http://localhost:5000/",
    proxyTimeout: 20 * 60 * 1000,
    pathRewrite: { "^/api": "" },
    timeout: 20 * 60 * 1000
  })
);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(parseInt(NODE_PORT || "3000", 10));
