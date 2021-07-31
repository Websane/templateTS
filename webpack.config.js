const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const path = require("path");

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const NODE_ENV = process.env.NODE_ENV;
const isDev = NODE_ENV === "development";
const isProd = !isDev;

const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

const plugins = () => {
  const basePlugins = [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename("css")}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "build/public"),
        },
      ],
    }),
  ];

  if (isProd) {
    basePlugins.push(
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      })
    );
  }

  return basePlugins;
};

module.exports = {
  mode: NODE_ENV ? NODE_ENV : "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
  plugins: plugins(),
  optimization: optimization(),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      //подгрузка стилей для локальных классов:
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              // modules: true,
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              // importLoaders: 1,
              // import: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      stage: 3,
                      browsers: "last 2 versions",
                      features: {
                        "nesting-rules": true, //тут придется добавлять '&' перед каждым вложением
                        "custom-properties": true,
                      },
                    },
                  ],
                  "postcss-nested", //тут синтаксис вложений в точности повторяет scss
                ],
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      //подгрузка стилей для глобальных классов:
      {
        test: /\.css$/,
        use: [styleLoader, "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            use: "@svgr/webpack",
            issuer: {
              and: [/\.(ts|tsx|js|jsx)$/],
            },
          },
          {
            test: /\.svg$/,
            type: "asset",
            generator: {
              filename: "images/[hash][ext][query]",
            },
          },
        ],
      },

      {
        test: /\.(woff|woff2)$/,
        type: "asset/inline",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
};
