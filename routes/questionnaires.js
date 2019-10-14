const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const Questionnaires = require('../models/Questionnaires');
const QueOptions = require('../models/QueOptions');
const jwt = require('jsonwebtoken');
const DeptService = require('../services/DeptService');

router.prefix('/api/questionnaires');

/**
* @api {get} /api/questionnaires?limit=&page=&title=&status=&userName=&phone=startTime=endTime= 投票问卷列表
* @apiName questionnaires-lists
* @apiGroup 投票问卷管理
* @apiDescription 投票问卷列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {String} [title] 活动标题
* @apiParam {Number} [status] 状态 0-编辑中 1-进行中 2-已结束 3-已下架
* @apiParam {String} [userName] 发起人姓名
* @apiParam {String} [phone] 发起人手机号
* @apiParam {String} [startDate] 开始日期,格式 2019-09-24
* @apiParam {String} [endDate] 截止日期，格式 2019-09-30
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷列表
* @apiSuccess {Number} data.count 投票问卷总数
* @apiSuccess {Object[]} data.rows 当前页投票问卷列表
* @apiSuccess {String} data.rows.title 投票问卷活动标题
* @apiSuccess {String} data.rows.description 描述
* @apiSuccess {String} data.rows.startTime 开始时间
* @apiSuccess {String} data.rows.endTime 结束时间
* @apiSuccess {String} data.rows.status 状态 状态 1-进行中 2-已结束 3-已下架
* @apiSuccess {String} data.rows.userId 发起人userId
* @apiSuccess {String} data.rows.userName 发起人姓名
* @apiSuccess {String} data.rows.phone 发起人手机
* @apiSuccess {String} data.rows.createdAt  创建时间
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let where = {};

	[ 'title', 'userName', 'phone' ].map(key => {
		if (query[key]) where[key] = { [Op.like]: `%${query[key]}%` };
	});
	if (query.status) where.status = Number(query.status);
	if (query.startDate) {
		let time = new Date(query.startDate);
		time.setHours(0, 0, 0, 0);
		where.createdTime = { [Op.gte]: time };
	}
	if (query.endDate) {
		let time = new Date(query.endDate);
		time.setHours(23, 59, 59, 59);
		where.createdTime = { [Op.lte]: time };
	}
	const res = await Questionnaires.findAndCountAll({
		where,
		limit,
		offset,
		attributes: [ 'id', 'title', 'description', 'status', 'userId', 'userName', 'phone', 'createdAt', 'startTime', 'endTime', 'depts' ],
		order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ]
	});
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {post} /api/questionnaires 创建投票问卷
* @apiName questionnaires-create
* @apiGroup 投票问卷管理
* @apiDescription 创建投票问卷
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 活动标题
* @apiParam {Date} startTime 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} endTime 截止时间 格式 2019-08-24 08:00:00
* @apiParam {Object[]} options 问卷选项详细信息
* @apiParam {Number} options.sequence 选项排序 例如1,2,3
* @apiParam {Number} options.type 选项类型 1-图文类型 2-文字类型
* @apiParam {String} options.title '选项标题'
* @apiParam {String} options.[description] '描述'
* @apiParam {String} options.[image] '图片名称'
* @apiParam {String} options.[video] '视屏名称'
* @apiParam {String} [description] 描述
* @apiParam {String} [video] 视屏名称
* @apiParam {Boolean} [commentAllowed] 是否允许评论,默认为 true
* @apiParam {Boolean} [commentVisible] 评论是否可见,默认为 true
* @apiParam {Boolean} [anonymous] 是否匿名投票，默认为 false
* @apiParam {Boolean} [realTimeVisiable] 实时结果是否对用户可视，默认为 true
* @apiParam {Number} [selectionNum] 单选多选 1-单选 2-多选, 默认为1 单选
* @apiParam {Number[]} [deptIds] 参与人范围所在部门ID, 不传该值则为所有部门人员都可以参与
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} data.id 投票问卷ID
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
		[ 'sequence', 'title', 'type' ].map(key => {
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
		phone: user.mobile || user.phone,
		commentAllowed: dataKeys.has('commentAllowed') ? !!data.commentAllowed : true,
		commentVisible: dataKeys.has('commentVisible') ? !!data.commentVisible : true,
		anonymous: dataKeys.has('anonymous') ? !!data.anonymous : false,
		realTimeVisiable: dataKeys.has('realTimeVisiable') ? !!data.realTimeVisiable : true,
		selectionNum: Number(data.selectionNum) || 1,
		status: 1,
		timestamp
	};
	const depts = [];
	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await DeptService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
		}
	}

	queData.depts = depts;
	// 存储问卷主信息
	const questionnaire = await Questionnaires.create(queData);

	// 存储选项信息
	let optionDatas = [];
	for (let option of options) {
		const optionData = { questionnaireId: questionnaire.id, timestamp };
		[ 'sequence', 'type', 'title', 'description', 'image', 'video' ].map(key => {
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
* @api {get} /api/questionnaires/:id 投票问卷信息
* @apiName questionnaires-info
* @apiGroup 投票问卷管理
* @apiDescription 投票问卷信息
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 投票问卷id
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} data.id 投票问卷活动ID
* @apiSuccess {String} data.title 投票问卷活动标题
* @apiSuccess {String} data.video 视屏名称
* @apiSuccess {String} data.description 描述
* @apiSuccess {String} data.startTime 开始时间
* @apiSuccess {String} data.endTime 结束时间
* @apiSuccess {String} data.userId 发起人userId
* @apiSuccess {String} data.userName 发起人姓名
* @apiSuccess {String} data.phone 发起人手机
* @apiSuccess {String} data.createdAt  创建时间
* @apiSuccess {Boolean} data.commentAllowed  是否允许评论
* @apiSuccess {Boolean} data.commentVisible  评论是否可见
* @apiSuccess {Boolean} data.anonymous  是否匿名投票
* @apiSuccess {Boolean} data.realTimeVisiable  实时结果是否对用户可视
* @apiSuccess {Number} data.selectionNum  单选多选 1-单选 2-多选
* @apiSuccess {Object[]} [data.depts]  投票范围
* @apiSuccess {String} data.depts.deptId  部门id
* @apiSuccess {String} data.depts.deptName 部门名称
* @apiSuccess {String} data.status 状态 状态 1-进行中 2-已结束 3-已下架
* @apiSuccess {Object[]} data.options  选项列表
* @apiSuccess {Number} data.options.id  选项数据ID
* @apiSuccess {Number} data.options.questionnaireId  问卷主数据ID
* @apiSuccess {Number} data.options.sequence  选项排序
* @apiSuccess {Number} data.options.type 选项类型 1-图文类型 2-文字类型
* @apiSuccess {String} data.options.title  选项标题
* @apiSuccess {String} data.options.description  描述
* @apiSuccess {String} data.options.image  图片名称
* @apiSuccess {String} data.options.video  视屏名称
* @apiSuccess {String} data.options.createdAt  创建时间
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/:id', async (ctx, next) => {
	let que = await Questionnaires.findOne({ where: { id: ctx.params.id } });
	que = que.toJSON();
	que.options = await QueOptions.findAll({ where: { questionnaireId: que.id, timestamp: que.timestamp } });
	ctx.body = ResService.success(que);
	await next();
});

/**
* @api {put} /api/questionnaires/:id 修改投票问卷
* @apiName questionnaire-modify
* @apiGroup 投票问卷管理
* @apiDescription 修改投票问卷
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 投票问卷id
* @apiParam {String} [title] 活动标题
* @apiParam {Date} [startTime] 开始时间 格式 2019-08-23 08:00:00
* @apiParam {Date} [endTime] 截止时间 格式 2019-08-24 08:00:00
* @apiParam {String} [video] 视屏名称
* @apiParam {String} [description] 描述
* @apiParam {Boolean} [commentAllowed]  是否允许评论
* @apiParam {Boolean} [commentVisible]  评论是否可见
* @apiParam {Boolean} [anonymous]  是否匿名投票
* @apiParam {Boolean} [realTimeVisiable]  实时结果是否对用户可视
* @apiParam {Number} [selectionNum]  单选多选 1-单选 2-多选
* @apiParam {Object[]} [depts]  投票范围
* @apiParam {String} depts.deptId  部门id
* @apiParam {String} depts.deptName 部门名称
* @apiParam {String} [status] 状态 1-进行中 2-已结束 3-已下架
* @apiParam {Object[]} [options]  选项列表
* @apiParam {Number} options.[id]  选项数据ID,传递ID做更新操作，不传值则为创建新选项操作
* @apiParam {Number} options.sequence  选项排序
* @apiParam {Number} options.type  选项类型 1-图文类型 2-文字类型
* @apiParam {String} options.title  选项标题
* @apiParam {String} [options.description]  描述
* @apiParam {String} [options.image]  图片名称
* @apiParam {String} [options.video]  视屏名称
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.put('/:id', async (ctx, next) => {
	const data = ctx.request.body;
	let questionnaire = await Questionnaires.findOne({ where: { id: ctx.params.id } });
	if (!questionnaire) {
		ctx.body = ResService.fail('系统中没有该问卷投票');
		return;
	}
	const timestamp = Date.now();
	const dataKeys = new Set(Object.keys(data));

	const queData = { timestamp };
	[ 'title', 'description', 'video', 'selectionNum' ].map(key => {
		if (data[key]) queData[key] = data[key];
	});

	if (data.startTime) {
		let time = new Date(data.startTime);
		time.setHours(0, 0, 0, 0);
		queData.startTime = time;
	}

	if (data.endTime) {
		let time = new Date(data.endTime);
		time.setHours(23, 59, 59, 59);
		queData.endTime = time;
	}

	if (dataKeys.has('commentAllowed')) queData.commentAllowed = !!data.commentAllowed;
	if (dataKeys.has('commentVisible')) queData.commentVisible = !!data.commentVisible;
	if (dataKeys.has('anonymous')) queData.anonymous = !!data.anonymous;
	if (dataKeys.has('realTimeVisiable')) queData.realTimeVisiable = !!data.realTimeVisiable;

	const depts = [];

	if (data.deptIds && data.deptIds.length) {
		for (let deptId of data.deptIds) {
			const dept = await DeptService.getDeptInfo(deptId);
			depts.push({ deptId, deptName: dept.deptName });
		}
	}
	// 更新主数据
	if (dataKeys.has('deptIds')) queData.depts = depts;
	await Questionnaires.update(queData, { where: { id: ctx.params.id } });

	// 更新选项数据
	const options = data.options || [];
	for (let option of options) {
		const optionData = { questionnaireId: questionnaire.id, timestamp };
		[ 'id', 'sequence', 'type', 'title', 'description', 'image', 'video' ].map(key => {
			if (option[key]) {
				optionData[key] = option[key];
			}
		});
		if (!option.id) {
			await QueOptions.create(optionData);
			continue;
		}
		await QueOptions.update(optionData, { where: { id: option.id } });
	}
	// 删除旧版本选项
	await QueOptions.destroy({ where: { questionnaireId: ctx.params.id, timestamp: { [Op.ne]: timestamp } } });
	ctx.body = ResService.success({ id: ctx.params.id });
});

/**
* @api {post} /api/questionnaires/status 设置当前状态
* @apiName questionnaires-status
* @apiGroup 投票问卷管理
* @apiDescription 设置当前状态 当前投票问卷数据状态 1-启用 2-停用中
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} questionnaireIds 投票问卷id表，例如 [1,2,3]
* @apiParam {Number} status 1-进行中 2-已结束 3-已下架
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/status', async (ctx, next) => {
	const { questionnaireIds, status } = ctx.request.body;

	return Questionnaires.update({ status: Number(status) }, { where: { id: { [Op.in]: questionnaireIds } } })
		.then(() => {
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			console.error('设置投票问卷当前状态失败', error);
			ctx.body = ResService.fail('设置失败');
			next();
		});
});

/**
* @api {post} /api/questionnaires/top 置顶操作
* @apiName questionnaires-top
* @apiGroup 投票问卷管理
* @apiDescription 置顶操作
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} questionnaireIds 投票问卷id表，例如 [1,2,3]
* @apiParam {Number} [top] false-不置顶 true-置顶, 默认 false 不置顶
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/top', async (ctx, next) => {
	let { questionnaireIds, top } = ctx.request.body;
	top = !!top;
	return Questionnaires.update({ top }, { where: { id: { [Op.in]: questionnaireIds } } })
		.then(() => {
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			console.error('设置投票问卷当前状态失败', error);
			ctx.body = ResService.fail('设置失败');
			next();
		});
});

module.exports = router;
