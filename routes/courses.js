const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const Courses = require('../models/Courses');
const Constants = require('../models/Constants');
const Chapters = require('../models/Chapters');
const Lessons = require('../models/Lessons');
const Stores = require('../models/Stores');
const jwt = require('jsonwebtoken');

router.prefix('/api/courses');

/**
* @api {post} /api/courses/types 创建课程类型
* @apiName course-type-create
* @apiGroup 课程管理
* @apiDescription 创建课程类型
* @apiHeader {String} authorization 登录token
* @apiParam {String} name 课程类型名称

* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 投票问卷信息
* @apiSuccess {Number} data.id 课程类型ID
* @apiSuccess {String} data.name 课程类型名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.post('/types', async (ctx, next) => {
	let { name } = ctx.request.body;
	if (!name || !name.trim()) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}
	name = name.trim();
	let type = await Constants.findOne({ where: { name, belongsTo: 1 } });
	if (type) {
		ctx.body = ResService.fail(`课程类型 ${name}已存在`);
		return;
	} else {
		let lastType = await Constants.findOne({ order: [ [ 'sequence', 'DESC' ], [ 'createdAt', 'DESC' ] ] });
		type = await Constants.create({ name, belongsTo: 1, sequence: lastType ? lastType.sequence + 1 : 1 });
	}
	ctx.body = ResService.success({ id: type.id, name: type.name });
	await next();
});

/**
* @api {get} /api/courses/typelists 课程类型列表
* @apiName course-type-lists
* @apiGroup 课程管理
* @apiDescription 课程类型列表
* @apiHeader {String} authorization 登录token
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object[]} data 投票问卷信息
* @apiSuccess {Number} data.id 课程类型ID
* @apiSuccess {String} data.name 课程类型名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/typelists', async (ctx, next) => {
	const res = await Constants.findAll({
		attributes: [ 'id', 'name' ],
		where: { belongsTo: 1 },
		order: [ [ 'createdAt', 'ASC' ] ]
	});
	ctx.body = ResService.success(res);
	await next();
});

/**
* @api {post} /api/courses/typedelete 删除课程类型
* @apiName course-type-delete
* @apiGroup 课程管理
* @apiDescription 删除课程类型
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 课程类型id
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.post('/delete', async (ctx, next) => {
	const { id } = ctx.request.body;
	if (!id) {
		ctx.body = ResService.fail('参数错误');
		return;
	}
	await Constants.destroy({ where: { id, belongsTo: 1 } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/courses 发布课程
* @apiName course-submit
* @apiGroup 课程管理
* @apiDescription 发布课程，课程详细信息可以通过返回值ID查询
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 课程标题
* @apiParam {Number} typeId 课程类型ID
* @apiParam {String} image 封面图片名称
* @apiParam {String} teacher 主讲人
* @apiParam {String} teacherDesc 主讲人简介
* @apiParam {Object[]} chapters 课程章信息
* @apiParam {String} chapters.sequence 章排序 1表示第一章 2表示第二章以此类推
* @apiParam {String} chapters.title 章名称，比如 第一章名称
* @apiParam {Object[]} chapters.lessons 节信息
* @apiParam {String} chapters.lessons.sequence 课程节排序 1-第一节 2-第二节 以此类推
* @apiParam {String} chapters.lessons.title 课程节节名称
* @apiParam {String} courses.lessons.video 课程节视屏名称
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 课程信息
* @apiSuccess {Number} data.id 课程ID
* @apiSuccess {String} data.title 课程名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/', async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const data = ctx.request.body;
	let { title, typeId, image, teacher, teacherDesc, chapters } = data;
	const type = await Constants.findOne({ where: { id: typeId || null, belongsTo: 1 } });
	let valid = true;
	if (!title || !typeId || !type || !image || teacher || !teacherDesc) {
		valid = false;
	}

	// 组织章节数据结构
	const chapterLists = [];
	for (let chapter of chapters) {
		if (!chapter.title || !chapter.sequence) { valid = false; break; };
		const chapterInfo = { sequence: chapter.sequence, title: chapter.title, lessons: [] };
		for (let lesson of chapter.lessons) {
			if (!lesson.title || !lesson.sequence) {
				valid = false;
				break;
			};
			chapterInfo.lessons.push({ title: lesson.title, sequence: lesson.sequence, video: lesson.video });
		}
		chapterLists.push(chapterInfo);
	}
	if (!chapterLists.length) valid = false;
	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	const timestamp = Date.now();
	const course = await Courses.create({
		title,
		image,
		typeId,
		typeName: type.name,
		teacher,
		teacherDesc,
		userId: user.userId,
		userName: user.userName,
		timestamp,
		onoff: 0
	});

	for (let chapterInfo of chapterLists) {
		let chapter = await Chapters.create({
			courseId: course.id,
			sequence: chapterInfo.sequence,
			title: chapterInfo.title,
			timestamp
		});
		for (let lessonInfo of chapterInfo.lessons) {
			lessonInfo.courseId = course.id;
			lessonInfo.chapterId = chapter.id;
			lessonInfo.timestamp = timestamp;
			await Lessons.create(lessonInfo);
		}
	}
	ctx.body = ResService.success({ id: course.id, title });
	await next();
});

/**
* @api {put} /api/courses/:id 编辑课程
* @apiName course-edit
* @apiGroup 课程管理
* @apiDescription 编辑课程，其中id为课程ID,写在param中，body数据为课程信息
* @apiHeader {String} authorization 登录token
* @apiParam {String} [title] 课程标题
* @apiParam {Number} [typeId] 课程类型ID
* @apiParam {String} [image] 封面图片名称
* @apiParam {String} [teacher] 主讲人
* @apiParam {String} [teacherDesc] 主讲人简介
* @apiParam {Object[]} [chapters] 课程章信息
* @apiParam {String} chapters.sequence 章排序 1表示第一章 2表示第二章以此类推
* @apiParam {String} chapters.title 章名称，比如 第一章名称
* @apiParam {Object[]} chapters.lessons 节信息
* @apiParam {String} chapters.lessons.sequence 课程节排序 1-第一节 2-第二节 以此类推
* @apiParam {String} chapters.lessons.title 课程节节名称
* @apiParam {String} courses.lessons.video 课程节视屏名称
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.put('/:id', async (ctx, next) => {
	const data = ctx.request.body;
	const id = ctx.params.id;
	const timestamp = Date.now();
	const courseData = {};
	const dataKeys = Object.keys(data);
	[ 'title', 'image', 'teacher', 'teacherDesc' ].map(key => {
		if (dataKeys.indexOf(key) > -1) {
			courseData[key] = data[key];
		}
	});
	let modified = false;
	if (dataKeys.indexOf('typeId') > -1) {
		const type = await Constants.findOne({ where: { id: data.typeId } });
		if (type) {
			courseData.typeId = data.typeId;
			courseData.typeName = type.name;
		}
	}
	// 更新主数据
	await Courses.update(courseData, { where: { id } });

	if (dataKeys.indexOf('chapters') > -1) {
		for (let chapterInfo of data.chapters) {
			// 更新已存在的章节
			if (chapterInfo.id) {
				await Chapters.update({
					timestamp,
					title: chapterInfo.title,
					sequence: chapterInfo.sequence
				}, { where: { id: chapterInfo.id } });
				modified = true;
				// 更新节
				for (let lessonInfo of chapterInfo.lessons) {
					if (lessonInfo.id) {
						await Lessons.update({
							timestamp,
							title: lessonInfo.title,
							sequence: lessonInfo.sequence,
							video: lessonInfo.video
						}, { where: { id: lessonInfo.id } });
					} else {
						await Lessons.create({
							timestamp,
							title: lessonInfo.title,
							sequence: lessonInfo.sequence,
							video: lessonInfo.video,
							courseId: id,
							chapterId: chapterInfo.id
						});
					}
				}
			} else {
				// 新建章节
				let chapter = await Chapters.create({
					title: chapterInfo.title,
					sequence: chapterInfo.sequence,
					timestamp,
					courseId: id
				});

				modified = true;

				for (let lessonInfo of chapterInfo.lessons) {
					await Lessons.create({
						timestamp,
						title: lessonInfo.title,
						sequence: lessonInfo.sequence,
						video: lessonInfo.video,
						courseId: id,
						chapterId: chapter.id
					});
				}
			}
		}
		// 更改
		if (modified) {
			await Courses.update({ timestamp }, { where: { id } });
			// 删除旧数据
			await Chapters.destroy({ where: { courseId: id, timestamp: { [Op.ne]: timestamp } } });
			await Lessons.destroy({ where: { courseId: id, timestamp: { [Op.ne]: timestamp } } });
		}
	}
	ctx.body = ResService.success({ id });
	await next();
});

/**
* @api {get} /api/courses?limit=&page=&keywords=&title=&startTime=&endTime=typeId= 获取课程列表
* @apiName course-lists
* @apiGroup 课程管理
* @apiDescription 课程列表
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [page] 当前页码，默认1
* @apiParam {Number} [limit] 每页条数，默认10
* @apiParam {String} [keywords] 关键字，可以按照关键字查询
* @apiParam {Date} [startTime] 创建时间开始日期，例如 2019-09-03 08:00
* @apiParam {Date} [endTime] 创建时间结束日期，例如 2019-09-03 08:00
* @apiParam {Date} [typeId] 课程类型ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 课程详情数据
* @apiSuccess {Number} data.count 总共课程条数
* @apiSuccess {Object[]} data.rows 当前页课程列表
* @apiSuccess {Number} data.rows.id 课程ID
* @apiSuccess {String} data.rows.title 课程标题
* @apiSuccess {Number} data.rows.typeId 课程类型ID
* @apiSuccess {String} data.rows.typeName课程类型名称
* @apiSuccess {String} data.rows.image 封面图片名称
* @apiSuccess {String} data.rows.teacher 主讲人
* @apiSuccess {String} data.rows.teacherDesc 主讲人简介
* @apiSuccess {String} data.rows.userId 创建人userId
* @apiSuccess {String} data.rows.userName 创建人姓名
* @apiSuccess {Date} data.rows.onTime 上架时间
* @apiSuccess {Date} data.rows.offTime 下架时间
* @apiSuccess {Number} data.rows.onoff 上架下架状态 0-未设置该状态 1-课程上架  2-课程下架
* @apiSuccess {Number} data.rows.lessonCount 当前课程总节数
* @apiSuccess {Number} data.rows.storeCount 当前课程总收藏人数
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.get('/', async (ctx, next) => {
	let query = ctx.query;
	let page = Number(query.page) || 1;
	let limit = Number(query.limit) || 10;
	let offset = (page - 1) * limit;
	let where = {};
	let keyMap = new Set(Object.keys(query));
	if (keyMap.has('keywords')) {
		if (!where[Op.or]) where[Op.or] = [];

		where[Op.or].push({	title: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ teacher: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ teacherDesc: { [Op.like]: `%${query.keywords}%` } });
	}
	if (keyMap.has('startTime')) {
		let date = new Date(query.startTime);
		if (!where.createdAt) where.createdAt = {};
		where.createdAt[Op.gte] = date;
	}
	if (keyMap.has('endTime')) {
		let date = new Date(query.endTime);
		if (!where.createdAt) where.createdAt = {};
		where.createdA[Op.lte] = date;
	}
	if (keyMap.has('typeId')) where.typeId = query.typeId;

	let courseRes = await Courses.findAndCountAll({ where, limit, offset, order: [ [ 'createdAt', 'DESC' ] ] });

	const res = [];
	for (let course of courseRes.rows) {
		course = course.toJSON();
		let lessonCount = await Lessons.count({ where: { courseId: course.id, timestamp: course.timestamp } });
		let storeCount = await Stores.count({ where: { courseId: course.id, belongsTo: 1 } });

		course.lessonCount = lessonCount;
		course.storeCount = storeCount;
		res.push(course);
	}
	ctx.body = ResService.success(res);
});

/**
* @api {get} /api/courses/:id 获取课程详情信息
* @apiName course-detail
* @apiGroup 课程管理
* @apiDescription 获取课程详情
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 课程ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 课程详情数据
* @apiSuccess {Number} data.id 课程ID
* @apiSuccess {String} data.title 课程标题
* @apiSuccess {Number} data.typeId 课程类型ID
* @apiSuccess {String} data.typeName课程类型名称
* @apiSuccess {String} data.image 封面图片名称
* @apiSuccess {String} data.teacher 主讲人
* @apiSuccess {String} data.teacherDesc 主讲人简介
* @apiSuccess {String} data.userId 创建人userId
* @apiSuccess {String} data.userName 创建人姓名
* @apiSuccess {Date} data.onTime 上架时间
* @apiSuccess {Date} data.offTime 下架时间
* @apiSuccess {Number} data.onoff 上架下架状态 0-未设置该状态 1-课程上架  2-课程下架
* @apiSuccess {Object[]} data.chapters 章节课程列表
* @apiSuccess {Number} data.chapters.id 章ID
* @apiSuccess {Number} data.chapters.sequence 章序号，比如 1表示第一章 2表示第二章 以此类推
* @apiSuccess {String} data.chapters.title 章标题，比如第一章：武大校友会现状
* @apiSuccess {Object[]} data.chapters.lessons 节列表
* @apiSuccess {Number} data.chapters.lessons.id 节ID
* @apiSuccess {Number} data.chapters.lessons.sequence 节序号，1-表示 第一节课 2-第二节课
* @apiSuccess {String} data.chapters.lessons.title 节标题
* @apiSuccess {String} data.chapters.lessons.video 节视屏名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/:id', async (ctx, next) => {
	const id = ctx.params.id;
	let course = await Courses.findOne({ where: { id } });
	if (!course) {
		ctx.body = ResService.fail('无法获取课程详情');
		return;
	}
	course = course.toJSON();
	const chapters = [];
	const chapterLists = await Chapters.findAll({ where: { courseId: id, timestamp: course.timestamp } });

	for (let chapter of chapterLists) {
		chapter = chapter.toJSON();
		const lessons = await Lessons.findAll({ where: { courseId: course.id, chapterId: chapter.id } });
		chapter.lessons = lessons;
		chapters.push(course);
	}
	course.chapters = chapters;

	ctx.body = ResService.success(course);
	await next();
});

/**
* @api {post} /api/courses/status 上线下线
* @apiName course-status
* @apiGroup 课程管理
* @apiDescription 设置课程状态，上线下线操作
* @apiHeader {String} authorization 登录token
* @apiParam {Number[]} courseIds 课程id数组 例如[1, 2]
* @apiParam {Number} status 1-上线 2-下线
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/status', async (ctx, next) => {
	let { courseIds, status } = ctx.request.body;
	status = Number(status);
	let value = { status };
	if (status === 1) value.publishTime = new Date();
	if (status === 2) value.offlineTime = new Date();
	await Courses.update({ status: Number(status) }, { where: { id: { [Op.in]: courseIds } } });
	ctx.body = ResService.success({});
	await next();
});

/**
* @api {post} /api/courses/:id 删除课程
* @apiName course-remove
* @apiGroup 课程管理
* @apiDescription 删除课程
* @apiHeader {String} authorization 登录token
* @apiParam {Number} id 课程id
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {}
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.delete('/:id', async (ctx, next) => {
	let id = ctx.params.id;
	await Courses.destroy({ where: { id } });
	ctx.body = ResService.success({});
	await next();
});

module.exports = router;
