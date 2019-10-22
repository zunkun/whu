module.exports = {
	apps: [ {
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env: {
			PORT: 3000,
			name: 'vote_dev',
			NODE_ENV: 'development'
		},
		env_production: {
			PORT: 3000,
			name: 'vote_pro',
			NODE_ENV: 'production'
		}
	}, {
		script: 'bin/schedule.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env: {
			PORT: 3002,
			name: 'vote_sch_dev',
			NODE_ENV: 'development'
		},
		env_production: {
			PORT: 3002,
			name: 'vote_sch_pro',
			NODE_ENV: 'production'
		}
	} ]
};
