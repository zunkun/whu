const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');

// 课程订阅表
class CoursePlans extends Model {}
CoursePlans.init({
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
		comment: '订阅状态 1-参与订阅课程  2-取消课程'
	}
}, { sequelize: postgres, modelName: 'courseplans', timestamps: false, paranoid: true, comment: '课程订阅表' });

CoursePlans.belongsTo(CourseMain);

CoursePlans.sync();

module.exports = CoursePlans;
