const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

// 课程类型
class CourseTypes extends Model {}
CourseTypes.init({
	name: {
		type: DataTypes.STRING,
		comment: '类型名称'
	},
	status: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		comment: '类型状态 1-使用中  2-删除'
	}
}, { sequelize: postgres, modelName: 'coursetypes', timestamps: false, paranoid: true, comment: '课程类型' });

CourseTypes.sync();

module.exports = CourseTypes;
