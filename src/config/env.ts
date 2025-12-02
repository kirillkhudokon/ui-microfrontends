export const config = {
  mode: import.meta.env.MODE as 'development' | 'production',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  cloudFrontUrl: import.meta.env.VITE_CLOUDFRONT_URL || '',
  
  remoteEntryUrl: import.meta.env.VITE_REMOTE_ENTRY_URL || 'http://localhost:5001/assets/remoteEntry.js',
  
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  env: import.meta.env.VITE_ENV || 'development',
} as const;

export type Config = typeof config;

if (config.isDevelopment) {
  console.log(' Environment Configuration:', config);
}

export default config;
