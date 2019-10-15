const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseType = require('./CourseTypes');

// 课程信息主表
class CourseMain extends Model {}
CourseMain.init({
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
	publishTime: {
		type: DataTypes.DATE,
		comment: '上线时间'
	},
	offlineTime: {
		type: DataTypes.DATE,
		comment: '下线时间'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		comment: '课程状态 0-未设置 1-上线课程  2下线课程 3-删除课程'
	}
}, { sequelize: postgres, modelName: 'coursemains', timestamps: false, paranoid: true, comment: '课程信息主表' });

CourseMain.belongsTo(CourseType);

CourseMain.sync();

module.exports = CourseMain;
