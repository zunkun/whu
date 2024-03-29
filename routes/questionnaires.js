const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const Questionnaires = require('../models/Questionnaires');
const QueOptions = require('../models/QueOptions');
const DingDepts = require('../models/DingDepts');
const DeptStaffs = require('../models/DeptStaffs');
const Votes = require('../models/Votes');
const jwt = require('jsonwebtoken');
const deptStaffService = require('../services/deptStaffService');
const config = require('../config');
const _ = require('lodash');
router.prefix('/api/questionnaires');

/**
* @api {get} /api/questionnaires?limit=&page=&title=&status=&userName=&mobile=startDate=endDate=&startTime=&endTime= 投票列表
* @apiName questionnaires-lists
* @apiGroup 投票管理
* @apiDescription 投票列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {String} [title] 投票标题
* @apiParam {Number} [onoff] 上架下架状态 0-上架下架未设置 1-已上架 2-已下架，不填写表示所有的
* @apiParam {Number} [status] 状态，0-未开始 1-进行中 2-已结束
* @apiParam {String} [userName] 发起人姓名
* @apiParam {String} [mobile] 发起人手机号
* @apiParam {String} [startDate] 开始日期,格式 2019-09-24,【已废弃】请使用 startTime
* @apiParam {String} [endDate] 截止日期，格式 2019-09-30 【已废弃】请使用endTime
* @apiParam {String} [startTime] 开始日期,格式 2019-09-24 08:00:00
* @apiParam {String} [endTime] 截止日期，格式 2019-09-24 08:00:00
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票列表
* @apiSuccess {Number} data.count 投票总数
* @apiSuccess {Object[]} data.rows 当前页投票列表
* @apiSuccess {String} data.rows.title 投票投票标题
* @apiSuccess {Number} data.rows.voteCount 当前已投票人数
* @apiSuccess {Boolean} data.rows.top 是否置顶， true置顶 false不置顶
* @apiSuccess {String} data.rows.description 描述
* @apiSuccess {String} data.rows.startTime 开始时间
* @apiSuccess {String} data.rows.endTime 结束时间
* @apiSuccess {String} data.rows.onoff 上架下架 0-上架下架未设置 1-已上架 2-已下架
* @apiSuccess {Date} data.rows.currentTime 访问服务器接口的时间记录
* @apiSuccess {String} data.rows.status 状态，0-未开始 1-进行中 2-已结束， 请注意只有当 onoff=1 表示上架状态当前值才有意义
* @apiSuccess {String} data.rows.userId 发起人userId
* @apiSuccess {String} data.rows.userName 发起人姓名
* @apiSuccess {String} data.rows.mobile 发起人手机
* @apiSuccess {String} data.rows.createdAt  创建时间
* @apiSuccess {Number[]} data.rows.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.rows.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
* @apiSuccess {Object[]} data.rows.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.rows.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.rows.specialUsers.userName  特殊选择参与人员userName
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let where = { userId: user.userId };
	if (user.userId === '677588') {
		delete where.userId;
	}
	let currentTime = new Date();

	[ 'title', 'userName', 'mobile' ].map(key => {
		if (query[key]) where[key] = { [Op.like]: `%${query[key]}%` };
	});
	if (query.onoff || query.onoff === 0 || query.onoff === '0') {
		where.onoff = Number(query.onoff);
	}
	if (query.status || query.status === 0 || query.status === '0') {
		let status = Number(query.status);

		if (status === 0) {
			where.startTime = { [Op.gt]: currentTime };
		}

		if (status === 1) {
			where.startTime = { [Op.lte]: currentTime };
			where.endTime = { [Op.gte]: currentTime };
		}
		// 已结束
		if (status === 2) {
			where.endTime = { [Op.lt]: currentTime };
		}
	}

	if (query.startDate) {
		let time = new Date(query.startDate);
		time.setHours(0, 0, 0, 0);
		if (!where.startTime) where.startTime = {};
		where.startTime[Op.gte] = time;
	}
	if (query.endDate) {
		let time = new Date(query.endDate);
		time.setHours(23, 59, 59, 59);
		if (!where.endTime) where.endTime = {};
		where.endTime[Op.lte] = time;
	}
	if (query.startTime) {
		let time = new Date(query.startTime);
		if (!where.startTime) where.startTime = {};
		where.startTime[Op.gte] = time;
	}

	if (query.endTime) {
		let time = new Date(query.endTime);
		if (!where.endTime) where.endTime = {};
		where.endTime[Op.gte] = time;
	}
	const ques = await Questionnaires.findAndCountAll({
		where,
		limit,
		offset,
		order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ]
	});
	const res = { count: ques.count, rows: [] };
	for (let que of ques.rows) {
		que = que.toJSON();
		que.voteCount = await Votes.count({ where: { questionnaireId: que.id } });
		que.currentTime = currentTime;
		let status;
		if (que.onoff === 0) {
			status = 0;
		} else if (currentTime > que.endTime) {
			status = 2;
		} else if (currentTime >= que.startTime) {
			status = 1;
		} else {
			status = 0;
		}
		que.status = status;
		res.rows.push(que);
	}
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {get} /api/questionnaires/ques?limit=&page=&status= 我可以参与的投票列表
* @apiName questionnaires-ques
* @apiGroup 投票管理
* @apiDescription 查询我可以参与的投票列表，本接口查询都是上线的投票
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {Number} [status] 状态，0-未开始 1-进行中 2-已结束,默认为1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票列表
* @apiSuccess {Number} data.count 投票总数
* @apiSuccess {Object[]} data.rows 当前页投票列表
* @apiSuccess {String} data.rows.title 投票投票标题
* @apiSuccess {Number} data.rows.voteCount 当前投票人数
* @apiSuccess {Boolean} data.rows.top 是否置顶， true置顶 false不置顶
* @apiSuccess {String} data.rows.description 描述
* @apiSuccess {String} data.rows.startTime 开始时间
* @apiSuccess {String} data.rows.endTime 结束时间
* @apiSuccess {String} data.rows.onoff 上架下架 0-上架下架未设置 1-已上架 2-已下架
* @apiSuccess {String} data.rows.userId 发起人userId
* @apiSuccess {String} data.rows.userName 发起人姓名
* @apiSuccess {String} data.rows.mobile 发起人手机
* @apiSuccess {String} data.rows.createdAt  创建时间
* @apiSuccess {Number[]} data.rows.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.rows.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
* @apiSuccess {Object[]} data.rows.specialUsers  特殊选择参与人员
* @apiSuccess {String} data.rows.specialUsers.userId  特殊选择参与人员userId
* @apiSuccess {String} data.rows.specialUsers.userName  特殊选择参与人员userName
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/ques', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let status = Number(query.status) || 1;
	if (status !== 1 || status !== 2) {
		ctx.body = ResService.fail('参数不正确');
	}

	let currentTime = new Date();
	const where = { onoff: 1 };
	if (status === 0) {
		where.startTime = { [Op.gt]: currentTime };
	}
	// 进行中
	if (status === 1) {
		where.startTime = { [Op.lte]: currentTime };
		where.endTime = { [Op.gte]: currentTime };
	}
	// 已结束
	if (status === 2) {
		where.endTime = { [Op.lt]: currentTime };
	}
	let deptIds = [];
	const deptStaffs = await DeptStaffs.findAll({ where: { userId: user.userId } });
	for (let deptStaff of deptStaffs) {
		let dept = await DingDepts.findOne({ where: { deptId: deptStaff.deptId } });
		deptIds = deptIds.concat(dept.deptPaths);
	}

	deptIds = Array.from(new Set(deptIds));
	if (!where[Op.or]) where[Op.or] = [];
	where[Op.or].push({ deptIds: { [Op.overlap]: deptIds } });
	where[Op.or].push({ specialUserIds: { [Op.contains]: [ user.userId ] } });

	const ques = await Questionnaires.findAndCountAll({
		where,
		limit,
		offset,
		order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ]
	});
	const res = { count: ques.count, rows: [] };
	for (let que of ques.rows) {
		que = que.toJSON();
		que.voteCount = await Votes.count({ where: { questionnaireId: que.id } });
		res.rows.push(que);
	}
	ctx.body = ResService.success(res);
});

/**
* @api {post} /api/questionnaires 创建投票
* @apiName questionnaires-create
* @apiGroup 投票管理
* @apiDescription 创建投票
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 投票标题
* @apiParam {Date} startTime 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} endTime 截止时间 格式 2019-08-24 08:00:00
* @apiParam {Object[]} options 问卷选项详细信息
* @apiParam {Number} options.sequence 选项排序 例如1,2,3
* @apiParam {String} options.title 选项标题
* @apiParam {String} options.[description] 描述
* @apiParam {String} options.[image] 图片名称
* @apiParam {String} options.[video] 视屏名称
* @apiParam {String} [description] 描述
* @apiParam {String} [video] 视屏名称
* @apiParam {Boolean} [commentAllowed] 是否允许评论,默认为 true
* @apiParam {Boolean} [commentVisible] 评论是否可见,默认为 true
* @apiParam {Boolean} [anonymous] 是否匿名投票，默认为 false
* @apiParam {Boolean} [realTimeVisiable] 实时结果是否对用户可视，默认为 true
* @apiParam {Number} [selectionNum] 单选多选 1-单选 2-多选, 默认为1 单选
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票信息
* @apiSuccess {Number} data.id 投票ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	let valid = true; // 传参是否正确
	if (!data.title || !data.startTime || !data.endTime) valid = false;
	let options = data.options;
	if (!options || !options.length) valid = false;

	for (let option of (options || [])) {
		[ 'sequence', 'title' ].map(key => {
			if (!option[key]) valid = false;
		});
		if (!valid) break;
	}
	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	const timestamp = Date.now();
	const dataKeys = new Set(Object.keys(data));

	// 问卷数据，参看Questionnaire model
	const queData = {
		title: data.title,
		startTime: new Date(data.startTime),
		endTime: new Date(data.endTime),
		description: data.description,
		video: data.video,
		userId: user.userId,
		userName: user.userName,
		mobile: user.mobile,
		commentAllowed: dataKeys.has('commentAllowed') ? !!data.commentAllowed : true,
		commentVisible: dataKeys.has('commentVisible') ? !!data.commentVisible : true,
		anonymous: dataKeys.has('anonymous') ? !!data.anonymous : false,
		realTimeVisiable: dataKeys.has('realTimeVisiable') ? !!data.realTimeVisiable : true,
		selectionNum: Number(data.selectionNum) || 1,
		onoff: 0,
		timestamp
	};
	const deptIds = [];
	const depts = [];
	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await deptStaffService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
			deptIds.push(deptId);
		}
	}

	const specialUserIds = [];
	const specialUsers = [];
	if (data.specialUserIds && data.specialUserIds.length) {
		for (let userId of data.specialUserIds) {
			let staff = await deptStaffService.getStaff(userId);
			specialUsers.push({ userId, userName: staff.userName });
			specialUserIds.push(userId);
		}
	}

	queData.deptIds = deptIds.length ? deptIds : [ 1 ];
	queData.depts = depts || [ { deptId: 1, deptName: config.corpName } ];
	queData.specialUserIds = specialUserIds;
	queData.specialUsers = specialUsers;
	if (!deptIds.length && !specialUserIds.length) {
		queData.deptIds = [ 1 ];
		queData.depts = [ { deptId: 1, deptName: config.corpName } ];
	}
	// 存储问卷主信息
	const questionnaire = await Questionnaires.create(queData);

	// 存储选项信息
	let optionDatas = [];
	for (let option of options) {
		const optionData = { questionnaireId: questionnaire.id, timestamp };
		[ 'sequence', 'title', 'description', 'image', 'video' ].map(key => {
			if (option[key]) {
				optionData[key] = option[key];
			}
		});
		optionDatas.push(optionData);
	}

	await QueOptions.bulkCreate(optionDatas);

	ctx.body = ResService.success({ id: questionnaire.id });
	await next();
});

/**
* @api {get} /api/questionnaires/:id?type= 投票信息
* @apiName questionnaires-info
* @apiGroup 投票管理
* @apiDescription 投票信息
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 投票id
* @apiParam {Number} type 投票访问权限 1-移动端查看 2-PC端管理， 默认为1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票信息
* @apiSuccess {Number} data.id 投票投票ID
* @apiSuccess {Number} data.voteCount 当前投票人数
* @apiSuccess {Boolean} data.top 是否置顶， true置顶 false不置顶
* @apiSuccess {String} data.title 投票投票标题
* @apiSuccess {String} data.video 视屏名称
* @apiSuccess {String} data.description 描述
* @apiSuccess {String} data.startTime 开始时间
* @apiSuccess {String} data.endTime 结束时间
* @apiSuccess {String} data.userId 发起人userId
* @apiSuccess {String} data.userName 发起人姓名
* @apiSuccess {String} data.mobile 发起人手机
* @apiSuccess {String} data.createdAt  创建时间
* @apiSuccess {Boolean} data.commentAllowed  是否允许评论
* @apiSuccess {Boolean} data.commentVisible  评论是否可见
* @apiSuccess {Boolean} data.anonymous  是否匿名投票
* @apiSuccess {Boolean} data.realTimeVisiable  实时结果是否对用户可视
* @apiSuccess {Number} data.selectionNum  单选多选 1-单选 2-多选
* @apiSuccess {Number[]} data.deptIds 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number[]} data.specialUserIds 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiSuccess {Object[]} data.depts  投票范围部门信息
* @apiSuccess {String} data.depts.deptId  部门id
* @apiSuccess {String} data.depts.deptName 部门名称
* @apiSuccess {Object[]} data.specialUsers  投票范围特别参与人员
* @apiSuccess {String} data.specialUsers.userId 人员userId
* @apiSuccess {String} data.specialUsers.userName 人员userName
* @apiSuccess {String} data.onoff 上架下架 0-上架下架未设置 1-已上架 2-已下架
* @apiSuccess {Date} data.currentTime 查询时的时间记录
* @apiSuccess {String} data.status 状态，0-未开始 1-进行中 2-已结束， 请注意只有当 onoff=1 表示上架状态当前值才有意义
* @apiSuccess {Object[]} data.options  选项列表
* @apiSuccess {Number} data.options.id  选项数据ID
* @apiSuccess {Number} data.options.questionnaireId  问卷主数据ID
* @apiSuccess {Number} data.options.sequence  选项排序
* @apiSuccess {String} data.options.title  选项标题
* @apiSuccess {String} data.options.description  描述
* @apiSuccess {String} data.options.image  图片名称
* @apiSuccess {String} data.options.video  视屏名称
* @apiSuccess {String} data.options.createdAt  创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/:id', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));

	const currentTime = new Date();
	let type = Number(ctx.query.type) || 1;
	let id = Number(ctx.params.id);
	let que = await Questionnaires.findOne({ where: { id } });
	if (!que) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	if (user.userId !== '677588') {
		if (type === 2) {
			if (que.userId !== user.userId) {
				ctx.body = ResService.fail('您没有权限访问该投票');
				return;
			}
		} else {
			let deptIds = [];
			const deptStaffs = await DeptStaffs.findAll({ where: { userId: user.userId } });
			for (let deptStaff of deptStaffs) {
				let dept = await DingDepts.findOne({ where: { deptId: deptStaff.deptId } });
				deptIds = deptIds.concat(dept.deptPaths);
			}

			deptIds = Array.from(new Set(deptIds));
			if (que.specialUserIds.indexOf(user.userId) === -1 && !_.intersection(que.deptIds, deptIds).length) {
				ctx.body = ResService.fail('您没有权限访问该投票');
				return;
			}
		}
	}

	que = que.toJSON();
	que.currentTime = currentTime;
	let status;
	if (currentTime > que.endTime) {
		status = 2;
	} else if (currentTime >= que.startTime) {
		status = 1;
	} else {
		status = 0;
	}
	que.status = status;
	que.options = await QueOptions.findAll({ where: { questionnaireId: que.id, timestamp: que.timestamp } });
	que.voteCount = await Votes.count({ where: { questionnaireId: que.id } });
	ctx.body = ResService.success(que);
	await next();
});

/**
* @api {post} /api/questionnaires/delete 删除投票
* @apiName questionnaires-del
* @apiGroup 投票管理
* @apiDescription 删除投票
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 投票id
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/delete', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));

	const { id } = ctx.request.body;
	let que = await Questionnaires.findOne({ where: { id } });
	if (!id || !id) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	if (user.userId !== '677588' && !que.userId !== user.userId) {
		ctx.body = ResService.fail('您没有权限删除当前投票');
		return;
	}

	await Questionnaires.destroy({ where: { id } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {POST} /api/questionnaires/modify 修改投票
* @apiName questionnaire-modify
* @apiGroup 投票管理
* @apiDescription 修改投票，注意如果系统中已有人投票，则不允许修改title,startTime,endTime, options等字段
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 投票id
* @apiParam {String} [title] 投票标题
* @apiParam {Date} [startTime] 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} [endTime] 截止时间 格式 2019-08-24 08:00:00
* @apiParam {String} [video] 视屏名称
* @apiParam {String} [description] 描述
* @apiParam {Boolean} [commentAllowed]  是否允许评论
* @apiParam {Boolean} [commentVisible]  评论是否可见
* @apiParam {Boolean} [anonymous]  是否匿名投票
* @apiParam {Boolean} [realTimeVisiable]  实时结果是否对用户可视
* @apiParam {Number} [selectionNum]  单选多选 1-单选 2-多选
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与
* @apiParam {Number[]} [specialUserIds] 特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息
* @apiParam {Object[]} [options]  选项列表
* @apiParam {Number} options.sequence  选项排序
* @apiParam {String} options.title  选项标题
* @apiParam {String} [options.description]  描述
* @apiParam {String} [options.image]  图片名称
* @apiParam {String} [options.video]  视屏名称
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/modify', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	const id = data.id;

	let questionnaire = await Questionnaires.findOne({ where: { id } });
	if (!id || !questionnaire) {
		ctx.body = ResService.fail('系统中没有该投票');
		return;
	}
	if (user.userId !== '677588' && user.userId !== questionnaire.userId) {
		ctx.body = ResService.fail('您没有权限修改该投票');
		return;
	}

	const timestamp = Date.now();
	const dataKeys = new Set(Object.keys(data));

	const queData = {
		title: data.title,
		startTime: new Date(data.startTime),
		endTime: new Date(data.endTime),
		description: data.description,
		video: data.video,
		commentAllowed: dataKeys.has('commentAllowed') ? !!data.commentAllowed : false,
		commentVisible: dataKeys.has('commentVisible') ? !!data.commentVisible : false,
		anonymous: dataKeys.has('anonymous') ? !!data.anonymous : false,
		realTimeVisiable: dataKeys.has('realTimeVisiable') ? !!data.realTimeVisiable : false,
		selectionNum: Number(data.selectionNum) || 1,
		timestamp
	};

	const depts = [];
	const deptIds = [];
	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await deptStaffService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
			deptIds.push(deptId);
		}
	}

	const specialUserIds = [];
	const specialUsers = [];
	if (data.specialUserIds && data.specialUserIds.length) {
		for (let userId of data.specialUserIds) {
			let staff = await deptStaffService.getStaff(userId);
			specialUsers.push({ userId, userName: staff.userName });
			specialUserIds.push(userId);
		}
	}
	if (dataKeys.has('deptIds') || dataKeys.has('specialUserIds')) {
		queData.depts = depts;
		queData.deptIds = deptIds;
		queData.specialUserIds = specialUserIds;
		queData.specialUsers = specialUsers;

		if (!deptIds.length && !specialUserIds.length) {
			queData.deptIds = [ 1 ];
			queData.depts = [ { deptId: 1, deptName: config.corpName } ];
		}
	}

	let vote = await Votes.findOne({ where: { questionnaireId: id } });
	if (vote) {
		// 有投票不得更新标题
		delete queData.title;
	}

	await Questionnaires.update(queData, { where: { id } });
	// 有投票不得更改和删除选项
	// 更新选项数据
	const options = data.options || [];
	if (!vote) {
		for (let option of options) {
			const optionData = { questionnaireId: questionnaire.id, timestamp };
			[ 'sequence', 'title', 'description', 'image', 'video' ].map(key => {
				optionData[key] = option[key];
			});
			await QueOptions.create(optionData);
		}
		// 删除旧版本选项
		await QueOptions.destroy({ where: { questionnaireId: id, timestamp: { [Op.ne]: timestamp } } });
	} else {
		for (let option of options) {
			const optionData = { questionnaireId: id, timestamp };
			[ 'sequence', 'title', 'description', 'image', 'video' ].map(key => {
				optionData[key] = option[key];
			});
			await QueOptions.update(optionData, { where: { questionnaireId: id, sequence: option.sequence } });
		}
	}

	ctx.body = ResService.success({ id });
});

/**
* @api {post} /api/questionnaires/onoff 上架下架
* @apiName questionnaires-onoff
* @apiGroup 投票管理
* @apiDescription 上架下架
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} questionnaireIds 投票id表，例如 [1,2,3]
* @apiParam {Number} onoff 1-上架 2-下架
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/onoff', async (ctx, next) => {
	const { questionnaireIds, onoff } = ctx.request.body;
	let user = jwt.decode(ctx.header.authorization.substr(7));

	let questionnaires = await Questionnaires.findAll({ where: { id: { [Op.in]: questionnaireIds } } });
	if (!questionnaireIds.length || !questionnaires.length) {
		ctx.body = ResService.fail('操作错误');
		return;
	}

	for (let que of questionnaires) {
		if (user.userId !== '677588' && que.userId !== user.userId) {
			ctx.body = ResService.fail(`您没有权限操作${que.title}投票`);
			return;
		}
	}

	return Questionnaires.update({ onoff: Number(onoff) }, { where: { id: { [Op.in]: questionnaireIds } } })
		.then(() => {
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			console.error('设置投票当前状态失败', error);
			ctx.body = ResService.fail('设置失败');
			next();
		});
});

/**
* @api {post} /api/questionnaires/top 置顶操作
* @apiName questionnaires-top
* @apiGroup 投票管理
* @apiDescription 置顶操作
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} questionnaireIds 投票id表，例如 [1,2,3]
* @apiParam {Number} [top] false-不置顶 true-置顶, 默认 false 不置顶
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/top', async (ctx, next) => {
	let { questionnaireIds, top } = ctx.request.body;
	top = !!top;

	let user = jwt.decode(ctx.header.authorization.substr(7));

	let questionnaires = await Questionnaires.findAll({ where: { id: { [Op.in]: questionnaireIds } } });
	if (!questionnaireIds.length || !questionnaires.length) {
		ctx.body = ResService.fail('操作错误');
		return;
	}

	for (let que of questionnaires) {
		if (user.userId !== '677588' && que.userId !== user.userId) {
			ctx.body = ResService.fail(`您没有权限操作${que.title}投票`);
			return;
		}
	}

	return Questionnaires.update({ top }, { where: { id: { [Op.in]: questionnaireIds } } })
		.then(() => {
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			console.error('设置投票当前状态失败', error);
			ctx.body = ResService.fail('设置失败');
			next();
		});
});

module.exports = router;
