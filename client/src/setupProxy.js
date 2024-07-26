const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        '/',
        createProxyMiddleware({
            "target": "http://localhost:3000",
            "changeOrigin": true,
            onProxyRes: function(proxyRes, req, res){
                proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
                proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
            }
        })
    )
}