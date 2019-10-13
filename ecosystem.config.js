module.exports = {
	apps: [ {
		name: 'whu_pro',
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env_production: {
			PORT: 3000,
			name: 'whu_pro',
			NODE_ENV: 'production'
		}
	}, {
		name: 'whu_schedule',
		script: 'bin/schedule.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env_production: {
			PORT: 3002,
			name: 'whu_schedule',
			NODE_ENV: 'production'
		}
	} ]
};
