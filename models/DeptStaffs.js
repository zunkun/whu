const postgres = require('../core/db/postgres');
const { DataTypes, Model } = require('sequelize');

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
	deptName: { type: DataTypes.STRING, comment: '部门名称' },
	typeId: {
		type: DataTypes.INTEGER,
		comment: '校友会类型部门ID'
	},
	typeName: {
		type: DataTypes.STRING,
		comment: '类型名称'
	}
}, { sequelize: postgres, modelName: 'deptstaffs', timestamps: false, comment: '钉钉组织架构与人员对应关系' });

DeptStaffs.sync();

module.exports = DeptStaffs;
