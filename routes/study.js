const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const CourseMain = require('../models/CourseMain');
const CourseTypes = require('../models/CourseTypes');
const Courses = require('../models/Courses');
const Chapters = require('../models/Chapters');
const Stores = require('../models/Stores');
const jwt = require('jsonwebtoken');

router.prefix('/api/study');

/**
* @api {post} /api/study/store 收藏取消课程
* @apiName study-store-manage
* @apiGroup 课程学习
* @apiDescription 收藏/取消收藏课程
* @apiHeader {String} authorization 登录token
* @apiParam {Number} coursemainId 课程主数据ID
* @apiParam {Number} status 操作 1-收藏 2-取消收藏
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} [data.id] 收藏做做返回此值收藏数据ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.post('/store', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	let { coursemainId, status } = ctx.request.body;
	status = Number(status);

	if (status === 1) {
		let coursemain = await Stores.findOne({ where: { userId: user.userId, coursemainId }, paranoid: false });
		if (coursemain) {
			ctx.body = ResService.fail('您已收藏过该课程');
			return;
		}
		const store = await Stores.create({ userId: user.userId, userName: user.userName, coursemainId });
		ctx.body = ResService.success({ id: store.id });
		return;
	}
	// 取消收藏
	if (status === 2) {
		await Stores.destroy({ where: { userId: user.userId, coursemainId } });
		ctx.body = ResService.success({});
	}
	await next();
});

/**
* @api {get} /api/study/userstore 个人收藏课程列表
* @apiName study-userstores
* @apiGroup 课程学习
* @apiDescription 个人收藏课程列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} coursemainId 课程主数据ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} data.id 收藏数据ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/userstore', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const { coursemainId } = ctx.request.body;

	let coursemain = await Stores.findOne({ where: { userId: user.userId }, offset, limit });
	if (coursemain) {
		ctx.body = ResService.fail('您已收藏过该课程');
		return;
	}
	const store = await Stores.create({ userId: user.userId, userName: user.userName, coursemainId });
	ctx.body = ResService.success({ id: store.id });
	await next();
});

module.exports = router;
