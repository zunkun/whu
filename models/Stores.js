const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');
const Courses = require('./Courses');

// 收藏表
class Stores extends Model {}
Stores.init({
	userId: {
		type: DataTypes.STRING,
		comment: '钉钉userId'
	},
	userName: {
		type: DataTypes.STRING,
		comment: '钉钉userName'
	},
	referId: {
		type: DataTypes.INTEGER,
		comment: '引用外键'
	},
	belongsTo: {
		type: DataTypes.INTEGER,
		comment: '收藏属于 1-在线学习课程'
	}
}, { sequelize: postgres, modelName: 'stores', timestamps: false, paranoid: true, comment: '收藏表' });

Stores.belongsTo(Courses);

Stores.sync();

module.exports = Stores;
