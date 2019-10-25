const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');
const dingding = require('../core/dingding');
const config = require('../config');
class DeptStaffService {
	/**
   * @constructor
   */
	constructor () {
		this.deptMap = new Map();
		this.staffMap = new Map();
	}

	async init () {
		await this.setAllDeptMaps();
		await this.setAllStaffMaps();
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
   * @param {Number} deptId 部门deptId
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

	/**
   * 设置所有staffMap
   */
	async setAllStaffMaps () {
		const staffs = await DingStaffs.findAll({});
		for (let staff of staffs) {
			this.staffMap.set(staff.userId, { userId: staff.userId, userName: staff.userName, mobile: staff.mobile });
		}
	}

	/**
   * @param {String} userId 人员userId
   * @returns {Object} user {userId: '', userName: '', mobile: ''}
   */
	async getStaff (userId) {
		if (!this.staffMap.has(userId)) {
			let staff = await DingStaffs.findOne({ where: { userId } });
			if (!staff) return { userId, userName: '', mobile: '' };
			this.staffMap.set(userId, { userId, userName: staff.userName, mobile: staff.mobile });
		}
		return this.staffMap.get(userId);
	}

	/**
	 * 设置钉钉获取用户数据到数据库
	 * @param {String} userId userId
	 * @param {Object} [user] 钉钉获取的user数据
	 */
	async upsertStaff (userId, user) {
		if (!user) {
			user = await dingding.getUser(userId);
		}
		let staffData = {
			userId: user.userid,
			userName: user.name,
			jobnumber: user.jobnumber,
			mobile: user.mobile,
			avatar: user.avatar,
			email: user.email
		};

		await DingStaffs.upsert(staffData, { where: { userId } });
		for (let deptId of user.department) {
			let deptInfo = await dingding.getDeptInfo(deptId);
			if (!deptInfo) {
				continue;
			}

			let deptPaths = await dingding.getDeptParentPath(deptId);
			DeptStaffs.upsert({
				userId,
				deptId,
				userName: user.name,
				deptName: deptInfo.name
			}, { where: { deptId, userId } });

			await DingDepts.upsert({
				deptId,
				deptName: deptInfo.name,
				parentId: deptInfo.parentid,
				deptPaths
			}, { where: { deptId } });
		}
	}
}

const service = new DeptStaffService();
service.init().then();
module.exports = service;
