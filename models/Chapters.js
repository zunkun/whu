const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Courses = require('./Courses');

// 课程表
class Chapters extends Model {}
Chapters.init({
	sequence: {
		type: DataTypes.INTEGER,
		comment: '课程序号，1-表示 第一课 2-表示第二课'
	},
	title: {
		type: DataTypes.STRING,
		comment: '课程名称'
	},
	timestamp: { type: DataTypes.BIGINT, comment: '标识数据版本流水' }
}, { sequelize: postgres, modelName: 'chapters', timestamps: false, paranoid: true, comment: '课程表' });

Chapters.belongsTo(Courses);

Chapters.sync();

module.exports = Chapters;
