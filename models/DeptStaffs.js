const mysql = require('../core/db/mysql');
const { DataTypes, Model } = require('sequelize');
const DingDepts = require('./DingDepts');
const DingStaffs = require('./DingStaffs');

// 钉钉组织架构与人员对应关系
class DeptStaffs extends Model {}
DeptStaffs.init({
	userId: {
		type: DataTypes.STRING,
		unique: 'deptstaff',
		comment: '钉钉员工userId'
	},
	deptId: {
		type: DataTypes.INTEGER,
		unique: 'deptstaff',
		comment: '钉钉部门的deptId'
	},
	userName: { type: DataTypes.STRING, comment: '员工姓名' },
	deptName: { type: DataTypes.STRING, comment: '部门名称' }
}, { sequelize: mysql, modelName: 'deptstaffs', timestamps: false, comment: '钉钉组织架构与人员对应关系' });

DeptStaffs.belongsTo(DingDepts, { foreignKey: 'dingdeptId' });
DeptStaffs.belongsTo(DingStaffs, { foreignKey: 'dingstaffId' });

DeptStaffs.sync();

module.exports = DeptStaffs;
