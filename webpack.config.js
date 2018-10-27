const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const paths = {
  appSrc: path.join(process.cwd(), 'src'),
  appIndex: path.join(process.cwd(), 'src', 'index.ts'),
  appBuild: path.join(process.cwd(), 'build'),
  public: '/'
}

module.exports = {
  entry: {
    main: [
      paths.appIndex
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  output: {
    filename: 'static/js/bundle.js',
    path: paths.appBuild,
    publicPath: paths.public
  },
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.png',
      hash: true
    }),
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development')
    })
  ],
  devtool: 'inline-source-map'
}
