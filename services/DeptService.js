const DingDepts = require('../models/DingDepts');
const config = require('../config');
class DeptService {
	/**
   * @constructor
   */
	constructor () {
		this.deptMap = new Map();
	}

	/**
   * 设置所有deptMap
   */
	async setAllDeptMaps () {
		const depts = await DingDepts.findAll({});
		for (let dept of depts) {
			this.deptMap.set(dept.deptId, { deptId: dept.deptId, deptName: dept.deptName, parentId: dept.parentId });
		}
		this.deptMap.set(1, { deptId: 1, deptName: config.corpName, parentId: 1 });
	}

	/**
   * @param {String} deptId 部门deptId
   * @returns {Object} dept {deptId: '', deptName: ''}
   */
	async getDeptInfo (deptId) {
		if (!this.deptMap.has(deptId)) {
			let dept = await DingDepts.findOne({ where: { deptId } });
			if (!dept) return { deptId, deptName: '' };
			this.deptMap.set(deptId, { deptId, deptName: dept.deptName, parentId: dept.parentId });
		}
		return this.deptMap.get(deptId);
	}
}

const deptService = new DeptService();
deptService.setAllDeptMaps().then();
module.exports = deptService;
