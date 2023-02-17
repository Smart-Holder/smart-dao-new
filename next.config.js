/** @type {import('next').NextConfig} */

const externals = function ({ context, request }, callback) {
  if (request.indexOf('noug') === 0) {
    callback(null, 'commonjs ' + request);
  } else if (
    [
      'path',
      'module',
      'vm',
      'fs',
      'dev-client',
      'quark/_ext',
      'quark/_util',
    ].indexOf(request) != -1
  ) {
    callback(null, 'commonjs ' + request);
  } else {
    callback(null, false);
  }
};

const nextConfig = {
  // exportPathMap: () => {
  //   return {
  //     '/': { page: '/' },
  //   };
  // },
  distDir: 'build',
  reactStrictMode: false,
  images: {
    domains: ['smart-dao-res.stars-mine.com'],
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    if (config.externals) {
      config.externals.push(externals);
    }

    if (config.module) {
      // 去掉警告: Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
      config.module.unknownContextRegExp = /^('|')\.\/.*?\1$/;
      config.module.unknownContextCritical = false;
    }

    return config;
  },
};

module.exports = nextConfig;
