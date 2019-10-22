module.exports = {
	apps: [ {
		name: 'vote_pro',
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env_production: {
			PORT: 3000,
			name: 'vote_pro',
			NODE_ENV: 'production'
		}
	}, {
		name: 'vote_sch_pro',
		script: 'bin/schedule.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env_production: {
			PORT: 3002,
			name: 'vote_sch_pro',
			NODE_ENV: 'production'
		}
	} ]
};
