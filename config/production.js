module.exports = {
	PORT: 3000,
	postgres: {
		host: '10.113.6.11',
		port: 5432,
		database: 'whu',
		username: 'whu',
		password: 'abcd1234'
	},
	secret: 'whu',
	baseDeptId: 1,
	dingBaseUri: 'https://oapi.dingtalk.com',
	corpId: 'ding2f9d4c2c3863312935c2f4657eb6378f',
	corpName: '武汉大学校友总会',
	agentId: '306193209',
	appkey: 'dingtxfdh35depfohu0a',
	appsecret: 'GLcPYrJIKkaFfCOdvyVMWNFevu1PiqdqRgtgFIZw5ZJqAXbtrYDIR_uOl0UoNQyn',
	nonceStr: 'afasdzwe',
	deptCron: '0 0 6 * * *', // 每日6时同步部门列表
	roleCron: '0 0 */1 * *', // 每隔1个小时同步角色列表
	videoPath: '/apps/files/video/',
	imagePath: '/apps/files/image/'
};
