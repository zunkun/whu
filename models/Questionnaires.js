const postgres = require('../core/db/postgres');
const {	DataTypes,	Model } = require('sequelize');

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
	mobile: {
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
	deptIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '参与人员范围,即分会deptId 空则为所有分会，否则为特定分会表'
	},
	depts: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		comment: '参与人员范围，deptId, deptName'
	},
	onoff: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '状态 0-上架下架未设置 1-已上架 2-已下架'
	},
	top: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		comment: '是否置顶'
	},
	timestamp: {
		type: DataTypes.BIGINT,
		comment: '数据流水'
	}
}, {
	sequelize: postgres,
	modelName: 'questionnaires',
	comment: '问卷信息，即投票基本信息',
	paranoid: true
});

Questionnaires.sync();
// .then(() => {
// 	console.log(555555555)
// 	// 处理id,id从1000开始自增
// 	return postgres.query('SELECT setval(\'questionnaires_id_seq\', max(id)) FROM questionnaires;	')
// 		.then(data => {
// 			let setval = Number(data[0][0].setval);
// 			if (setval < 1000) {
// 				return postgres.query('SELECT setval(\'questionnaires_id_seq\', 1000, true);');
// 			}
// 			return Promise.resolve();
// 		});
// });

module.exports = Questionnaires;
