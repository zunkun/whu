const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 提问
class Questions extends Model {}
Questions.init({
	userId: {
		type: DataTypes.STRING,
		comment: '钉钉userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '钉钉用户姓名'
	},
	visible: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		comment: '提问是否显示 true 显示 false 隐藏'
	},
	referId: {
		type: DataTypes.INTEGER,
		comment: '引用外键'
	},
	belongsTo: {
		type: DataTypes.INTEGER,
		comment: '该提问属于 1-在线学习课程'
	}
}, { sequelize: postgres, modelName: 'questions', timestamps: false, paranoid: true, comment: '提问' });

Questions.sync();

module.exports = Questions;
