const mysql = require('../core/db/mysql');
const { DataTypes, Model } = require('sequelize');
const Questionnaries = require('./Questionnaires');

// 问卷选项详细信息
class Options extends Model {}

Options.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '选项排序'
	},
	type: {
		type: DataTypes.INTEGER,
		comment: '选项类型 1-图文类型 2-文字类型',
		defaultValue: 1
	},
	title: {
		type: DataTypes.STRING,
		comment: '选项标题'
	},
	description: {
		type: DataTypes.TEXT,
		comment: '描述'
	},
	image: {
		type: DataTypes.STRING,
		comment: '图片名称'
	},
	video: {
		type: DataTypes.STRING,
		comment: '视屏名称'
	}
}, {
	sequelize: mysql,
	modelName: 'Options',
	comment: '问卷选项信息',
	paranoid: true
});

// 与问卷主信息表关系
Questionnaries.hasMany(Options);
Options.belongsTo(Questionnaries);

Options.sync();

module.exports = Options;
