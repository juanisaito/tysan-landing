const path = require('path');

module.exports = {
  // Configuración para optimizar el build
  optimization: {
    // Separar vendor chunks para mejor caching
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // Separar React y ReactDOM
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
        // Separar Framer Motion
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer',
          chunks: 'all',
        }
      }
    },
    // Minimizar en producción
    minimize: process.env.NODE_ENV === 'production',
  },
  
  // Configuración de output para mejor caching
  output: {
    filename: process.env.NODE_ENV === 'production' 
      ? 'static/js/[name].[contenthash:8].js'
      : 'static/js/[name].js',
    chunkFilename: process.env.NODE_ENV === 'production'
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
  },
  
  // Configuración de módulos
  module: {
    rules: [
      // Optimizar imágenes
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8kb
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // Optimizar fuentes
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  
  // Configuración de plugins
  plugins: [
    // Plugin para generar manifest con hashes
    new (require('webpack-manifest-plugin'))({
      fileName: 'asset-manifest.json',
    }),
  ],
  
  // Configuración de resolve
  resolve: {
    alias: {
      // Aliases para mejor performance
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  
  // Configuración de performance
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}; 