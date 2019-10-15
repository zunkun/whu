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
router.prefix('/api/votes');

/**
* @api {post} /api/votes 投票
* @apiName votes-create
* @apiGroup 投票管理
* @apiDescription 投票
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 活动ID
* @apiParam {Number[]} checkedIds 投票选项ID, 示例单选 [1],多选 [1, 2, 3]

* @apiParam {String} [comment] 评论
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} data.id 投票问卷ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	console.log({ data });
	if (!data.questionnaireId || !Array.isArray(data.checkedIds) || !data.checkedIds.length) {
		ctx.body = ResService.fail('参数不正确');
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
				return Promise.reject('您已对当前问卷投票做了投票');
			}
			return Questionnaires.findOne({ where: { id: data.questionnaireId } })
				.then(que => {
					if (!que) {
						return Promise.reject('系统中没有当前问卷');
					}
					if (voteTime < que.startTime || voteTime > que.endTime) {
						return Promise.reject('不在投票区间');
					}
					if (que.selectionNum === 1) {
						voteData.checkedIds = data.checkedIds[0];
					} else {
						voteData.checkedIds = data.checkedIds.join('|');
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
* @apiDescription 获取人员对某一活动的投票结果
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 活动ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票结果数据
* @apiSuccess {Number} data.id 投票结果ID
* @apiSuccess {Number} data.questionnaireId 投票活动ID
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
* @apiParam {Number} questionnaireId 问卷活动ID
* @apiParam {Number} [limit] 分页条数，默认10
* @apiParam {Number} [page] 第几页，默认1
* @apiParam {Number} [status] 状态 0-编辑中 10-进行中 20-已结束 30-已下架,不传则查询所有评论
* @apiSuccess {Object} data 返回数据
* @apiSuccess {Number} data.count 总共评论条数
* @apiSuccess {Object[]} data.rows 当前页评论列表
* @apiSuccess {Number} data.rows.id 投票结果ID
* @apiSuccess {Number} data.rows.questionnaireId 投票活动ID
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
	if (queryKeys.has('status')) where.statsu = Number(query.status);

	return Votes.findAndCountAll({ where, limit, offset }).then(votes => {
		ctx.body = ResService.success(votes);
		next();
	}).catch(error => {
		console.error('获取评论列表失败', error);
		ctx.body = ResService.fail('获取评论列表失败');
		next();
	});
});

/**
* @api {get} /api/votes/options?questionnaireId= 投票结果统计
* @apiName votes-options-results
* @apiGroup 投票管理
* @apiDescription 投票结果统计，显示所有选项参与投票的人员信息统计
* @apiHeader {String} authorization 登录token
* @apiParam {Number} questionnaireId 问卷活动ID
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
* @apiSuccess {Number} data.options.votes.questionnaireId 投票活动ID
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
	let personCount = await Votes.count({ where: { questionnaireId } }); // 总投票人数
	let optionRes = [];
	for (let option of options) {
		let voteDatas = await Votes.findAndCountAll({	where: { questionnaireId, checkedIds: { [Op.regexp]: `${option.id}||${option.id}|` } } });
		console.log({ voteDatas });
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
		for (let i = 0, len = optionRes.length; i < len - 2; i++) {
			let item = optionRes[i];
			item.percent = Number((item.count / ticketCount).toFixed(3));
			percentCount += item.percent;
		}
		optionRes[optionRes.length - 1].percent = 1 - percentCount;
	}
	console.log({ ticketCount, personCount });
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
* @apiParam {Number} questionnaireId 问卷活动ID
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
* @apiSuccess {String} data.rows.mobile 发起人手机
* @apiSuccess {String} data.rows.createdAt  创建时间
* @apiSuccess {Object[]} data.rows.depts  投票范围
* @apiSuccess {String} data.rows.depts.deptId  部门id
* @apiSuccess {String} data.rows.depts.deptName 部门名称
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

	const res = await Questionnaires.findAndCountAll({
		where: { id: { [Op.in]: questionnaireIds } },
		limit,
		offset,
		attributes: [ 'id', 'title', 'description', 'status', 'userId', 'userName', 'mobile', 'createdAt', 'startTime', 'endTime', 'depts', 'top' ],
		order: [ [ 'createdAt', 'DESC' ] ]
	});
	ctx.body = ResService.success(res);
	await next();
});

module.exports = router;
