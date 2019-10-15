const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const CourseMain = require('./CourseMain');

// 课程收藏表
class Stores extends Model {}
Stores.init({
	userId: {
		type: DataTypes.STRING,
		comment: '钉钉userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '钉钉userName'
	}
}, { sequelize: postgres, modelName: 'stores', timestamps: false, paranoid: true, comment: '课程收藏表' });

Stores.belongsTo(CourseMain);

Stores.sync();

module.exports = Stores;
