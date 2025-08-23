module.exports = {
    apps: [
        {
            name: 'nous-api-client',
            script: 'src/index.ts',
            interpreter: 'tsx',
            interpreter_args: '--experimental-loader tsx/esm',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                TS_NODE_PROJECT: './tsconfig.json'
            },
            env_production: {
                NODE_ENV: 'production',
                TS_NODE_PROJECT: './tsconfig.json'
            },
            error_file: './logs/pm2-error.log',
            out_file: './logs/pm2-out.log',
            log_file: './logs/pm2-combined.log',
            time: true,
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            restart_delay: 4000,
            max_restarts: 10,
            min_uptime: '10s',
            kill_timeout: 30000,
            wait_ready: true,
            listen_timeout: 10000,
            kill_retry_time: 2000,
            windowsHide: true,
            cwd: process.cwd()
        }
    ],
};
