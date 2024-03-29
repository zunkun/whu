const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');

const dingding = require('../core/dingding');
const config = require('../config');
const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize');

let total = 0;
class StructureSchedule {
	constructor () {
		this.date = moment().format('YYYY-MM-DD');
		this.deptMap = new Map();
		this.departments = [];
		this.dingdeptIdMap = new Map();
		this.startTime = Date.now();
		this.pathMap = new Map();
	}

	async start () {
		this.startTime = Date.now();
		await this.sync();
		const task = cron.schedule(config.deptCron, async () => {
			this.date = moment().format('YYYY-MM-DD');
			this.startTime = Date.now();
			await this.sync();
		});
		return task.start();
	}

	async sync () {
		await this.syncDepts();
		await this.syncStaffs();
		await this.syncType();
		let endTime = Date.now();
		console.log(`开始时间 ${new Date(this.startTime)} 结束时间 ${new Date(endTime)} 用时 ${(endTime - this.startTime) / 1000} s`);
	}

	/**
	 * 获取所有子部门deptId列表
	 * @param {Number} deptId deptId
	 */
	async getSubDeptIds (deptId) {
		let depts = await dingding.getDeptLists({ id: deptId, fetch_child: true });
		let deptIds = [ deptId ];
		for (let dept of depts) {
			deptIds.push(dept.id);
		}
		return deptIds;
	}

	async syncDepts () {
		console.log('【开始】获取部门列表');
		this.pathMap = new Map();

		this.departments = await dingding.getDeptLists({ fetch_child: true });

		if (!this.departments.length) {
			return Promise.reject('【失败】没有获取到部门列表');
		}

		this.deptMap.set(1, {
			deptName: config.corpName,
			parentId: 1
		});

		for (let department of this.departments) {
			this.deptMap.set(department.id, {
				deptName: department.name,
				parentId: department.parentid
			});
		}

		for (let department of this.departments) {
			let paths = this.getPaths(department.id, []);
			this.pathMap.set(department.id, paths);
		}
		this.pathMap.set(1, [ 1 ]);
		this.departments.push({
			id: 1,
			name: config.corpName,
			parentid: 1
		});

		console.log('【开始】保存部门列表');
		for (let department of this.departments) {
			DingDepts.upsert({
				deptId: department.id,
				deptName: department.name,
				parentId: department.parentid,
				deptPaths: this.pathMap.get(department.id) || [],
				subdeptIds: await this.getSubDeptIds(department.id) || [ department.id ]
			}, {
				where: {
					deptId: department.id
				},
				returning: true
			});
		}
		console.log('【成功】保存部门列表');
		return Promise.resolve();
	}

	getPaths (deptId, paths = []) {
		paths.push(deptId);
		if (deptId === 1) {
			return paths;
		}
		let parentId = this.deptMap.get(deptId).parentId;
		if (this.pathMap.has(parentId)) {
			paths = paths.concat(this.pathMap.get(parentId));
			return paths;
		}
		return this.getPaths(parentId, paths);
	}

	async syncStaffs () {
		for (let index = 0; index < this.departments.length; index++) {
			let department = this.departments[index];
			console.log(`【保存】 ${department.name} ${index + 1} 人员列表`);
			await this.syncDeptStaffs(department.id, index + 1);
		}
		console.log(`总人数 ${total} 总用时  ${(Date.now() - this.startTime) / 1000} s`);
	}

	async syncDeptStaffs (deptId, index) {
		let time = Date.now();
		console.log(`当前时间 ${(time - this.startTime) / 1000} s`);
		console.log(`【开始】${index} 获取部门 ${deptId} ${this.deptMap.get(deptId).deptName} 人员列表`);
		if (!deptId) return Promise.resolve();

		let userLists = await dingding.getDeptUsers(deptId);
		let total1 = total;
		total = total + userLists.length;
		console.log(`【保存】${index} 部门 ${deptId} ${this.deptMap.get(deptId).deptName} 人员列表`);
		console.log(`部门 ${index}  人员数 ${userLists.length} 已处理 ${total1} 处理后 ${total}`);
		try {
			for (let user of userLists) {
				let staffData = {
					userId: user.userid,
					userName: user.name,
					jobnumber: user.jobnumber,
					mobile: user.mobile,
					avatar: user.avatar,
					email: user.email
				};

				DingStaffs.upsert(staffData, { where: { userId: user.userid }, returning: true });
				DeptStaffs.upsert({
					userId: user.userid,
					deptId,
					userName: user.name,
					deptName: this.deptMap.get(deptId).deptName || ''
				}, { where: { deptId, userId: user.userid } });
			}
			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async syncType () {
		let depts = await DingDepts.findAll({ where: { parentId: 1, deptId: { [Op.ne]: 1 } } });
		for (let dept of depts) {
			let deptArray = await DingDepts.findAll({ where: { deptPaths: { [Op.overlap]: [ dept.deptId ] } } });
			let deptIds = [];
			for (let deptInfo of deptArray) {
				deptIds.push(deptInfo.deptId);
			}

			await DingDepts.update({ typeId: dept.deptId, typeName: dept.deptName }, { where: { deptId: { [Op.in]: deptIds } } });
			await DeptStaffs.update({ typeId: dept.deptId, typeName: dept.deptName }, { where: { deptId: { [Op.in]: deptIds } } });
		}
	}
}

const structureSchedule = new StructureSchedule();

module.exports = structureSchedule.start();
