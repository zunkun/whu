const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseType = require('./CourseTypes');

// 课程信息主表
class Courses extends Model {}
Courses.init({
	title: {
		type: DataTypes.STRING,
		comment: '课程标题'
	},
	coursetypeId: {
		type: DataTypes.INTEGER,
		comment: '课程类型ID'
	},
	coursetypeName: {
		type: DataTypes.STRING,
		comment: '课程类型名称'
	},
	image: {
		type: DataTypes.STRING,
		comment: '封面图片名称'
	},
	desc: {
		type: DataTypes.TEXT,
		comment: '简介'
	},
	teacher: {
		type: DataTypes.STRING,
		comment: '主讲人'
	},
	teacherDesc: {
		type: DataTypes.TEXT,
		comment: '主讲人简介'
	},
	userId: {
		type: DataTypes.STRING,
		comment: '创建人userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '创建人userName'
	},
	onTime: {
		type: DataTypes.DATE,
		comment: '上架时间'
	},
	offTime: {
		type: DataTypes.DATE,
		comment: '下架时间'
	},
	onoff: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '上架下架状态 0-未设置该状态 1-课程上架  2-课程下架'
	}
}, { sequelize: postgres, modelName: 'coursess', timestamps: false, paranoid: true, comment: '课程信息主表' });

Courses.belongsTo(CourseType);

Courses.sync();

module.exports = Courses;
