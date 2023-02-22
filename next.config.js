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
  // trailingSlash: true,
  exportPathMap: () => {
    return {
      '/': { page: '/' },

      '/launch': { page: '/launch' },
      '/launch/index': { page: '/launch' },
      '/launch/information': { page: '/launch/information' },
      '/launch/setting': { page: '/launch/setting' },
      '/launch/start': { page: '/launch/start' },

      '/mine': { page: '/mine' },
      '/mine/index': { page: '/mine' },

      '/dashboard/mine/home': { page: '/dashboard/mine/home' },
      '/dashboard/mine/assets': { page: '/dashboard/mine/assets' },
      '/dashboard/mine/assets/index': { page: '/dashboard/mine/assets' },
      '/dashboard/mine/assets/detail': {
        page: '/dashboard/mine/assets/detail',
      },
      '/dashboard/mine/income': { page: '/dashboard/mine/income' },
      '/dashboard/mine/information': { page: '/dashboard/mine/information' },
      '/dashboard/mine/order': { page: '/dashboard/mine/order' },

      '/dashboard/governance/proposal': {
        page: '/dashboard/governance/proposal',
      },
      '/dashboard/governance/votes': { page: '/dashboard/governance/votes' },

      '/dashboard/member/nftp': { page: '/dashboard/member/nftp' },

      '/dashboard/basic/information': { page: '/dashboard/basic/information' },
      '/dashboard/basic/executor': { page: '/dashboard/basic/executor' },
      '/dashboard/basic/tax': { page: '/dashboard/basic/tax' },
      '/dashboard/basic/vote': { page: '/dashboard/basic/vote' },

      '/dashboard/financial/assets': { page: '/dashboard/financial/assets' },
      '/dashboard/financial/assets/index': {
        page: '/dashboard/financial/assets',
      },
      '/dashboard/financial/assets/issue': {
        page: '/dashboard/financial/assets/issue',
      },
      '/dashboard/financial/income': { page: '/dashboard/financial/income' },
      '/dashboard/financial/order': { page: '/dashboard/financial/order' },
    };
  },
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
