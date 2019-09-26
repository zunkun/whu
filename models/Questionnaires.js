const mysql = require('../core/db/mysql');
const { DataTypes, Model } = require('sequelize');

// 问卷信息，本系统前端为投票
class Questionnaires extends Model {}

Questionnaires.init({
	title: {
		type: DataTypes.STRING,
		comment: '活动标题'
	},
	description: {
		type: DataTypes.TEXT,
		comment: '描述'
	},
	video: {
		type: DataTypes.STRING,
		comment: '视屏名称'
	},
	startTime: {
		type: DataTypes.DATE,
		comment: '开始时间'
	},
	endTime: {
		type: DataTypes.DATE,
		comment: '结束时间'
	},
	userId: {
		type: DataTypes.STRING,
		comment: '发起人钉钉userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '发起人姓名'
	},
	phone: {
		type: DataTypes.STRING,
		comment: '发起人手机号码'
	},
	// 下面是功能设置
	commentAllowed: {
		type: DataTypes.BOOLEAN,
		comment: '是否允许评论',
		defaultValue: true
	},
	commentVisible: {
		type: DataTypes.BOOLEAN,
		comment: '评论是否可见',
		defaultValue: true
	},
	anonymous: {
		type: DataTypes.BOOLEAN,
		comment: '是否匿名投票',
		defaultValue: false
	},
	realTimeVisiable: {
		type: DataTypes.BOOLEAN,
		comment: '实时结果是否对用户可视',
		defaultValue: true
	},
	selectionNum: {
		type: DataTypes.INTEGER,
		comment: '单选多选 1-单选 2-多选',
		defaultValue: 1
	},
	depts: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '参与人员范围,即分会deptId, deptName {deptId: \'\', deptName: \'\'} 空则为所有分会，否则为特定分会表'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '状态 1-进行中 2-已结束 3-已下架'
	}
}, {
	sequelize: mysql,
	modelName: 'questionnaires',
	comment: '问卷信息，即投票基本信息',
	paranoid: true
});

Questionnaires.sync()
	.then(() => {
		// 处理id,id从10000开始自增
		return mysql.query('SELECT MAX(id) AS MAXID from questionnaires')
			.then(data => {
				let MAXID = data[0].MAXID;
				if (!MAXID || MAXID < 10000) {
					return mysql.query('ALTER TABLE questionnaires AUTO_INCREMENT=10000;');
				}
				return Promise.resolve();
			});
	});

module.exports = Questionnaires;
