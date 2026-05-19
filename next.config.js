/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  
  // Disable source maps so no one sees original code
  productionBrowserSourceMaps: false,
  
  webpack: (config, { isServer }) => {
    // Only obfuscate client-side code in production
    if (!isServer && isProduction) {
      const WebpackObfuscator = require('webpack-obfuscator');
      
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        enforce: 'post', // Apply after Next.js processing
        use: [
          {
            loader: WebpackObfuscator.loader,
            options: {
              compact: true,
              selfDefending: true,  // 🔥 BREAKS CODE IF MODIFIED
              controlFlowFlattening: 0.75,
              deadCodeInjection: true,
              rotateStringArray: true,
              stringArray: true,
              stringArrayEncoding: ['base64'],
              transformObjectKeys: true,
              domainLock: [
                'shakzztv.vercel.app',  // Replace with your Vercel domain
                'shakzztv.com'          // Add custom domain if you have one
              ],
              exclude: [
                'node_modules/**/*',
                '**/*.test.js',
              ]
            }
          }
        ]
      });
    }
    
    return config;
  },
}

module.exports = nextConfig
