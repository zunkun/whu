const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Questionnaries = require('./Questionnaires');

// 问卷投票结果
class Votes extends Model {}

Votes.init({
	questionnaireId: {
		type: DataTypes.INTEGER,
		comment: '问卷投票ID',
		allowNull: false
	},
	userId: {
		type: DataTypes.STRING,
		comment: '投票人userId',
		allowNull: false,
		key: {}
	},
	userName: {
		type: DataTypes.STRING,
		comment: '投票人姓名'
	},
	mobile: {
		type: DataTypes.STRING,
		comment: '投票人手机号码'
	},
	avatar: {
		type: DataTypes.STRING,
		comment: '钉钉图像'
	},
	voteTime: {
		type: DataTypes.DATE,
		comment: '投票时间'
	},
	checkedIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		comment: '投票人选择选项表ID，参看 Options表'
	},
	comment: {
		type: DataTypes.STRING,
		comment: '评论'
	},
	commentStatus: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '评论状态 0-已提交 1-通过 2-未通过 3-已删除'
	}
}, {
	sequelize: postgres,
	modelName: 'votes',
	comment: '问卷选项信息',
	paranoid: true
});

// 与问卷主信息表关系
Questionnaries.hasMany(Votes);
Votes.belongsTo(Questionnaries);

Votes.sync();

module.exports = Votes;
