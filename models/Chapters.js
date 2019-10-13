const mysql = require('../core/db/mysql');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');
const Courses = require('./Courses');

// 课程章节
class Chapters extends Model {}
Chapters.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '章节序号，1-表示 第一节课 2-第二节课'
	},
	title: {
		type: DataTypes.STRING,
		comment: '章节名称'
	},
	video: {
		type: DataTypes.STRING,
		comment: '章节视屏名称'
	},
	timestamp: { type: DataTypes.BIGINT, comment: '标识数据版本流水' }
}, { sequelize: mysql, modelName: 'chapters', timestamps: false, paranoid: true, comment: '课程章节' });

Chapters.belongsTo(CourseMain);
Chapters.belongsTo(Courses);

Chapters.sync();

module.exports = Chapters;
