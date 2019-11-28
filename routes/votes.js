const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const Votes = require('../models/Votes');
const Questionnaires = require('../models/Questionnaires');
const QueOptions = require('../models/QueOptions');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const voteSet = new Set();
const DingDepts = require('../models/DingDepts');
const DeptStaffs = require('../models/DeptStaffs');
const _ = require('lodash');

router.prefix('/api/votes');

/**
* @api {post} /api/votes 投票
* @apiName votes-create
* @apiGroup 投票管理
* @apiDescription 投票
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 投票ID
* @apiParam {Number[]} checkedIds 投票选项ID, 示例单选 [1],多选 [1, 2, 3]

* @apiParam {String} [comment] 评论
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票信息
* @apiSuccess {Number} data.id 投票ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	let que = await Questionnaires.findOne({ where: { id: data.questionnaireId } });
	if (!data.questionnaireId || !Array.isArray(data.checkedIds) || !data.checkedIds.length || !que) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
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

	// 去除重复提交
	const voteStr = `${user.userId}:${data.questionnaireId}`;
	if (voteSet.has(voteStr)) {
		ctx.body = ResService.fail('重复提交');
		return;
	}
	voteSet.add(voteStr);
	const voteTime = new Date();
	// 投票数据
	const voteData = {
		questionnaireId: data.questionnaireId,
		userId: user.userId,
		userName: user.userName,
		mobile: user.mobile,
		avatar: user.avatar,
		voteTime
	};
	if (data.comment) {
		voteData.comment = data.comment;
		voteData.commentStatus = 0;
	}
	// 不允许重复投票
	return Votes.findOne({ where: { questionnaireId: data.questionnaireId, userId: user.userId } })
		.then(vote => {
			if (vote) {
				return Promise.reject('您已对当前投票做了投票');
			}
			return Questionnaires.findOne({ where: { id: data.questionnaireId } })
				.then(que => {
					if (!que) {
						return Promise.reject('系统中没有当前投票');
					}
					if (voteTime < que.startTime || voteTime > que.endTime) {
						return Promise.reject('不在投票区间');
					}
					if (que.selectionNum === 1) {
						voteData.checkedIds = [ data.checkedIds[0] ];
					} else {
						voteData.checkedIds = data.checkedIds;
					}
					return Votes.create(voteData);
				});
		})
		.then(() => {
			voteSet.delete(voteStr);
			ctx.body = ResService.success({});
			next();
		}).catch(error => {
			voteSet.delete(voteStr);
			ctx.body = ResService.fail(error);
			next();
		});
});

/**
* @api {get} /api/votes/info?questionnaireId= 获取投票结果
* @apiName votes-info
* @apiGroup 投票管理
* @apiDescription 获取人员对某一投票的投票结果
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 投票ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票结果数据
* @apiSuccess {Number} data.id 投票结果ID
* @apiSuccess {Number} data.questionnaireId 投票投票ID
* @apiSuccess {String} data.userId 投票人userId
* @apiSuccess {String} data.userName 投票人姓名
* @apiSuccess {String} data.mobile 投票人员手机
* @apiSuccess {String} data.avatar 投票人头像
* @apiSuccess {Date} data.voteTime 投票时间
* @apiSuccess {Number[]} data.checkedIds 投票选择的选项ID
* @apiSuccess {String} data.comment 评论
* @apiSuccess {Number} data.commentStatus 评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/info', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { questionnaireId } = ctx.query;

	let que = await Questionnaires.findOne({ where: { id: questionnaireId } });

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

	return Votes.findOne({ where: { questionnaireId, userId: user.userId } })
		.then(vote => {
			ctx.body = ResService.success(vote);
			next();
		})
		.catch(error => {
			console.error('获取用户投票失败', error);
			ctx.body = ResService.fail('获取投票信息失败');
			next();
		});
});

/**
* @api {get} /api/votes/comments?limit=&page=&status=questionnaireId 投票评论表
* @apiName votes-comments
* @apiGroup 投票管理
* @apiDescription 投票评论表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 问卷投票ID
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {Number} [status] 评论状态 0-已提交 1-通过 2-未通过 3-已删除
* @apiSuccess {Object} data 返回数据
* @apiSuccess {Number} data.count 总共评论条数
* @apiSuccess {Object[]} data.rows 当前页评论列表
* @apiSuccess {Number} data.rows.id 投票结果ID
* @apiSuccess {Number} data.rows.questionnaireId 投票投票ID
* @apiSuccess {String} data.rows.userId 投票人userId
* @apiSuccess {String} data.rows.userName 投票人姓名
* @apiSuccess {String} data.rows.mobile 投票人员手机
* @apiSuccess {String} data.rows.avatar 投票人头像
* @apiSuccess {Date} data.rows.voteTime 投票时间
* @apiSuccess {Number[]} data.rows.checkedIds 投票选择的选项ID
* @apiSuccess {String} data.rows.comment 评论
* @apiSuccess {Number} data.rows.commentStatus 评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
 */
router.get('/comments', async (ctx, next) => {
	const query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	if (!query.questionnaireId) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	const where = { questionnaireId: query.questionnaireId, comment: { [Op.ne]: null } };

	const queryKeys = new Set(Object.keys(query));
	if (queryKeys.has('status')) where.status = Number(query.status);

	const votes = await Votes.findAndCountAll({ where, limit, offset });
	ctx.body = ResService.success(votes);
	await next();
});

/**
* @api {post} /api/votes/commentStatus 设置评论状态
* @apiName votes-set-comentStatus
* @apiGroup 投票管理
* @apiDescription 设置评论状态
* @apiHeader {String} authorization 登录token
* @apiParam {Number} voteId 投票ID
* @apiParam {Number} status 状态 1-通过 2-不通过 3-删除
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/commentStatus', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { voteId, status } = ctx.request.body;
	let vote = await Votes.findOne({ where: { id: voteId } });
	if (!voteId || !status || !vote) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	let que = await Questionnaires.findOne({ where: { id: vote.questionnaireId } });
	if (!que) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	if (user.userId !== '677588' && user.userId !== que.userId) {
		ctx.body = ResService.fail('您没有权限访问该评论');
		return;
	}

	await Votes.update({ commentStatus: Number(status) }, { where: { id: voteId } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {get} /api/votes/options?questionnaireId= 投票结果统计
* @apiName votes-options-results
* @apiGroup 投票管理
* @apiDescription 投票结果统计，显示所有选项参与投票的人员信息统计
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 问卷投票ID
* @apiSuccess {Object} data 返回数据
* @apiSuccess {Number} data.ticketCount 总票数
* @apiSuccess {Number} data.personCount 参与投票人数
* @apiSuccess {Object[]} data.options 选项信息

* @apiSuccess {Object} data.options.option 当前选项信息
* @apiSuccess {Number} data.options.option.id  当前选项数据ID
* @apiSuccess {Number} data.options.option.questionnaireId  问卷主数据ID
* @apiSuccess {Number} data.options.option.sequence  选项排序
* @apiSuccess {Number} data.options.option.type  选项类型 1-图文类型 2-文字类型
* @apiSuccess {String} data.options.option.title  选项标题
* @apiSuccess {String} data.options.option.description  描述
* @apiSuccess {String} data.options.option.image  图片名称
* @apiSuccess {String} data.options.option.video  视屏名称
* @apiSuccess {String} data.options.option.createdAt  创建时间

* @apiSuccess {Number} data.options.count 当前选项总票数
* @apiSuccess {Number} data.options.percent 当前选项投票百分比

* @apiSuccess {Object[]} data.options.votes 当前选项投票评论列表
* @apiSuccess {Number} data.options.votes.id 投票结果ID
* @apiSuccess {Number} data.options.votes.questionnaireId 投票投票ID
* @apiSuccess {String} data.options.votes.userId 投票人userId
* @apiSuccess {String} data.options.votes.userName 投票人姓名
* @apiSuccess {String} data.options.votes.mobile 投票人员手机
* @apiSuccess {String} data.options.votes.avatar 投票人头像
* @apiSuccess {Date} data.options.votes.voteTime 投票时间
* @apiSuccess {Number[]} data.options.votes.checkedIds 投票选择的选项ID
* @apiSuccess {String} data.options.votes.comment 评论
* @apiSuccess {Number} data.options.votes.commentStatus 评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
 */
router.get('/options', async (ctx, next) => {
	const { questionnaireId } = ctx.query;

	const options = await QueOptions.findAll({ where: { questionnaireId } });
	let ticketCount = 0; // 总票数
	let optionRes = [];
	let optionIds = [];
	for (let option of options) {
		optionIds.push(option.id);
		let voteDatas = await Votes.findAndCountAll({	where: { questionnaireId, checkedIds: { [Op.contains]: [ option.id ] } } });
		ticketCount += voteDatas.count;
		optionRes.push({
			option,
			count: voteDatas.count, // 当前选项投票票数
			percent: 0,
			votes: voteDatas.rows
		});
	}
	// 計算百分比
	if (ticketCount) {
		let percentCount = 0;
		for (let i = 0, len = optionRes.length; i <= len - 2; i++) {
			let item = optionRes[i];
			optionRes[i].percent = Number((item.count * 100 / ticketCount).toFixed(2));
			percentCount += item.percent;
		}
		optionRes[optionRes.length - 1].percent = 100 - percentCount;
	}
	let personCount = await Votes.count({ where: { questionnaireId, checkedIds: { [Op.overlap]: optionIds } } }); // 总投票人数,此处过滤掉已经删除的选项
	ctx.body = ResService.success({
		ticketCount,
		personCount,
		options: optionRes
	});
	await next();
});

/*
* @api {get} /api/votes/commentsOut?questionnaireId 导出投票结果
* @apiName votes-comments-out
* @apiGroup 投票管理
* @apiDescription 导出投票结果,只返回前端评论列表，由前端生成Excel表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 问卷投票ID
* @apiSuccess {Object} data 返回数据
* @apiSuccess {String} data['评论人'] 评论人
* @apiSuccess {String} data['评论时间'] 评论时间
* @apiSuccess {String} data['评论'] 评论
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/commentsOut', async (ctx, next) => {
	const { questionnaireId } = ctx.query;
	const where = { questionnaireId, comment: { [Op.ne]: null } };
	const comments = [];
	const votes = await Votes.findAll({ where });
	for (let vote of votes) {
		comments.push({
			'评论人': vote.userName,
			'评论时间': moment(vote.voteTime).format('YYYY-MM-DD HH:mm:sss'),
			'评论内容': vote.comment
		});
	}
	ctx.body = ResService.success(comments);
});

/**
* @api {get} /api/votes/participate?limit=&page 我参与的投票
* @apiName votes-participate
* @apiGroup 投票管理
* @apiDescription 我参与的投票
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票列表
* @apiSuccess {Number} data.count 投票总数
* @apiSuccess {Object[]} data.rows 当前页投票列表
* @apiSuccess {String} data.rows.title 投票投票标题
* @apiSuccess {Number} data.rows.voteCount 当前已投票人数
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
router.get('/participate', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	const votes = await Votes.findAll({
		attributes: [ 'id', 'questionnaireId' ],
		where: { userId: user.userId }
	});
	const questionnaireIds = [];
	for (let vote of votes) {
		questionnaireIds.push(vote.questionnaireId);
	}

	const where = { id: { [Op.in]: questionnaireIds } };
	const ques = await Questionnaires.findAndCountAll({
		where,
		limit,
		offset,
		order: [ [ 'top', 'DESC' ], [ 'createdAt', 'DESC' ] ]
	});
	const currentTime = new Date();
	const res = { count: ques.count, rows: [] };
	for (let que of ques.rows) {
		que = que.toJSON();
		que.voteCount = await Votes.count({ where: { questionnaireId: que.id } });
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
		res.rows.push(que);
	}
	ctx.body = ResService.success(res);
	await next();
});

module.exports = router;
