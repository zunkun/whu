const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');

// 课程提问
class CourseQues extends Model {}
CourseQues.init({
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
		comment: '提问状态 1-显示 2-隐藏'
	}
}, { sequelize: postgres, modelName: 'courseques', timestamps: false, paranoid: true, comment: '课程提问' });

CourseQues.belongsTo(CourseMain);

CourseQues.sync();

module.exports = CourseQues;
