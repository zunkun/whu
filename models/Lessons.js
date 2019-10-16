const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Courses = require('./Courses');
const Chapters = require('./Chapters');

// 第几节课
class Lessons extends Model {}
Lessons.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '课程节序号，1-表示 第一节课 2-第二节课'
	},
	title: {
		type: DataTypes.STRING,
		comment: '课程节名称'
	},
	video: {
		type: DataTypes.STRING,
		comment: '课程节 视屏名称'
	},
	timestamp: { type: DataTypes.BIGINT, comment: '标识数据版本流水' }
}, { sequelize: postgres, modelName: 'lessons', timestamps: false, paranoid: true, comment: '第几节课' });

Lessons.belongsTo(Courses);
Lessons.belongsTo(Chapters);

Lessons.sync();

module.exports = Lessons;
