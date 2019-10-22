const DingDepts = require('../models/DingDepts');
const DingStaffs = require('../models/DingStaffs');
const DeptStaffs = require('../models/DeptStaffs');
const DingSyncs = require('../models/DingSyncs');

const dingding = require('../core/dingding');
const config = require('../config');
const cron = require('node-cron');
const moment = require('moment');
let startTime = Date.now();

let total = 0;
class StructureSchedule {
	constructor () {
		this.date = moment().format('YYYY-MM-DD');
		this.deptMap = new Map();
		this.departments = [];
		this.dingdeptIdMap = new Map();
		this.pathMap = new Map();
	}

	async start () {
		await this.sync();
		const task = cron.schedule(config.deptCron, async () => {
			this.date = moment().format('YYYY-MM-DD');
			await this.sync();
		});
		return task.start();
	}

	async sync () {
		// let sync = await DingSyncs.findOne({ where: { date: this.date, status: 1 } });
		// if (sync) {
		// 	console.log('当日已经同步部门人员信息，不再同步');
		// }
		try {
			await this.syncDepts();
			await this.syncStaffs();
			let endTime = Date.now();
			console.log(`用时 ${(endTime - startTime) / 1000} s`);
			await DingSyncs.upsert({ date: this.date, status: 1 }, { where: { date: this.date } });
		} catch (error) {
			console.log({ error });
			await DingSyncs.upsert({ date: this.date, status: 2 }, { where: { date: this.date } });
		}
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

		console.log('【开始】保存部门列表');
		for (let department of this.departments) {
			await DingDepts.upsert({
				deptId: department.id,
				deptName: department.name,
				parentId: department.parentid,
				deptPaths: this.pathMap.get(department.id) || []
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
		console.log(`总人数 ${total} 总用时  ${(Date.now() - startTime) / 1000} s`);
	}

	async syncDeptStaffs (deptId, index) {
		let time = Date.now();
		console.log(`当前时间 ${(time - startTime) / 1000} s`);
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

				await DingStaffs.upsert(staffData, { where: { userId: user.userid }, returning: true });
				await DeptStaffs.upsert({
					userId: user.userid,
					deptId,
					userName: user.name,
					deptName: this.deptMap.get(deptId).deptName || ''
				}, { where: { deptId, userId: user.userid } });
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

const structureSchedule = new StructureSchedule();

module.exports = structureSchedule.start();
