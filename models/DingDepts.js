const mysql = require('../core/db/mysql');
const { DataTypes, Model } = require('sequelize');

// 钉钉组织架构
class DingDepts extends Model {}
DingDepts.init({
	deptId: {
		type: DataTypes.INTEGER,
		unique: true,
		comment: '钉钉部门id'
	}, // 钉钉部门deptId
	deptName: {
		type: DataTypes.STRING,
		comment: '部门名称'
	} // 部门名称
}, { sequelize: mysql, modelName: 'dingdepts', timestamps: false, comment: '钉钉组织架构' });

DingDepts.sync();

module.exports = DingDepts;
