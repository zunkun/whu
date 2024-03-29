const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 评论
class Comments extends Model {}
Comments.init({
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
		comment: '评论是否显示 true 显示 false 隐藏'
	},
	referId: {
		type: DataTypes.INTEGER,
		comment: '引用外键'
	},
	belongsTo: {
		type: DataTypes.INTEGER,
		comment: '该评论属于 1-在线学习课程'
	}
}, { sequelize: postgres, modelName: 'comments', timestamps: false, paranoid: true, comment: '评论' });

Comments.sync();

module.exports = Comments;
