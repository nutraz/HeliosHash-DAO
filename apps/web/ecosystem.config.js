export default {
  apps: [
    {
      name: 'helioshash-web',
      script: 'pnpm',
      args: 'dev -p 3002',
      cwd: __dirname,
      env: {
        NEXT_PUBLIC_FORCE_HEAVY_SPLASH: 'true',
        NODE_ENV: 'development'
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
}
