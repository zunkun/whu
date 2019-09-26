module.exports = {
	PORT: 3000,
	mysql: {
		host: '127.0.0.1',
		port: 3306,
		database: 'iss',
		username: 'root',
		password: 'abcd1234'
	},
	secret: 'isssa',
	baseDeptId: 1,
	dingBaseUri: 'https://oapi.dingtalk.com',
	corpId: 'dingcbcbb63d3edd5478',
	corpName: '上海铭悦软件有限公司',
	agentId: '271444139',
	appkey: 'ding9vrsww4git23xdod',
	appsecret: 'GMVTGc5ZpnNXjqruYrucjXxqaS29Rnj6Q37tP1utg57YeUH3V-Tc4tASEcyuLIWr',
	nonceStr: 'afasdzwe',
	deptCron: '0 0 6 * * *', // 每日6时同步部门列表
	roleCron: '0 0 */1 * *', // 每隔1个小时同步角色列表
	videoPath: '/apps/files/videos/',
	imagePath: '/apps/files/images/'
};
