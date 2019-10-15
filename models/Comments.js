const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');

// 课程评价
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
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '评论状态 1-显示 2-隐藏'
	}
}, { sequelize: postgres, modelName: 'comments', timestamps: false, paranoid: true, comment: '课程评价' });

Comments.belongsTo(CourseMain);

Comments.sync();

module.exports = Comments;
