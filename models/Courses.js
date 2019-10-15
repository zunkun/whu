const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');

// 课程表
class Courses extends Model {}
Courses.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '课程序号，1-表示 第一课 2-表示第二课'
	},
	title: {
		type: DataTypes.STRING,
		comment: '课程名称'
	},
	timestamp: { type: DataTypes.BIGINT, comment: '标识数据版本流水' }
}, { sequelize: postgres, modelName: 'courses', timestamps: false, paranoid: true, comment: '课程表' });

Courses.belongsTo(CourseMain);

Courses.sync();

module.exports = Courses;
