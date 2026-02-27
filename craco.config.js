//扩展webpack的配置
const path = require("path");

module.exports = {
  typescript: {
    enableTypeChecking: true, // 开启类型检查
  },
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      // 配置 fallback，忽略 Node 核心模块
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: false, // 忽略 http 模块
        https: false, // 忽略 https 模块
        stream: false, // 可选：若后续报 stream 错误也忽略
      };
      webpackConfig.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
      return webpackConfig;
    },
  },
};
