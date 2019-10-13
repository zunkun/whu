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
	let courseType = await CourseTypes.findOne({ where: { name } });
	if (courseType) {
		if (courseType.status === 1) {
			ctx.body = ResService.fail(`课程类型 ${name}已存在`);
			return;
		}
		await CourseTypes.update({ status: 1 }, { where: { id: courseType.id } });
	} else {
		courseType = await CourseTypes.create({ name });
	}
	ctx.body = ResService.success(courseType);
	await next();
});

/**
* @api {post} /api/courses 发布课程
* @apiName course-submit
* @apiGroup 课程管理
* @apiDescription 发布课程，课程详细信息可以通过返回值ID查询
* @apiHeader {String} authorization 登录token
* @apiParam {String} title 课程标题
* @apiParam {Number} coursetypeId 课程类型ID
* @apiParam {String} image 封面图片名称
* @apiParam {String} teacher 主讲人
* @apiParam {String} teacherDesc 主讲人简介
* @apiParam {Object[]} courses 课程信息
* @apiParam {String} courses.sequence 章排序 1表示第一章 2表示第二章以此类推
* @apiParam {String} courses.title 章名称，比如 第一章名称
* @apiParam {Object[]} courses.chapters 节信息
* @apiParam {String} courses.chapters.sequence 节排序 1-第一节 2-第二节 以此类推
* @apiParam {String} courses.chapters.title 节名称
* @apiParam {String} courses.chapters.video 视屏名称
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
	let { title, coursetypeId, image, teacher, teacherDesc, courses } = data;
	const courseType = await CourseTypes.findOne({ where: { id: coursetypeId || null } });
	let valid = true;
	if (!title || !coursetypeId || !courseType || !image || teacher || !teacherDesc) {
		valid = false;
	}

	// 组织章节数据结构
	const courseLists = [];
	for (let course of courses) {
		if (!course.title || !course.sequence) { valid = false; break; };
		const courseInfo = { sequence: course.sequence, title: course.title, chapters: [] };
		for (let index in course.chapters) {
			let chapter = course.chapters[index];
			if (!chapter.title || !chapter.sequence) {
				valid = false;
				break;
			};
			courseInfo.chapters.push({ title: chapter.title, sequence: courseInfo.chapters.length + 1, video: chapter.video });
		}
		courseLists.push(courseInfo);
	}
	if (!courseLists.length) valid = false;
	if (!valid) {
		ctx.body = ResService.fail('参数不正确');
		return;
	}

	const courseMain = await CourseMain.create({
		title,
		image,
		coursetypeId,
		coursetypeName: courseType.name,
		teacher,
		teacherDesc,
		userId: user.userId,
		userName: user.userName,
		status: 1
	});

	const timestamp = Date.now();

	for (let courseInfo of courseLists) {
		let course = await Courses.create({
			coursemainId: courseMain.id,
			sequence: courseInfo.sequence,
			title: courseInfo.title,
			timestamp
		});
		for (let chapterInfo of courseInfo.chapters) {
			chapterInfo.coursemainId = courseMain.id;
			chapterInfo.courseId = course.id;
			chapterInfo.timestamp = timestamp;
			await Chapters.create(chapterInfo);
		}
	}
	ctx.body = ResService.success({ id: courseMain.id, title });
	await next();
});

/**
* @api {put} /api/courses/:id 编辑课程
* @apiName course-submit
* @apiGroup 课程管理
* @apiDescription 编辑课程，其中id为课程ID,写在param中，body数据为课程信息
* @apiHeader {String} authorization 登录token
* @apiParam {String} [title] 课程标题
* @apiParam {Number} [coursetypeId] 课程类型ID
* @apiParam {String} [image] 封面图片名称
* @apiParam {String} [teacher] 主讲人
* @apiParam {String} [teacherDesc] 主讲人简介
* @apiParam {Object[]} [courses] 课程信息
* @apiParam {String} courses.title 章名称，比如 第一章名称
* @apiParam {Object[]} courses.chapters 节信息
* @apiParam {String} courses.chapters.title 节名称
* @apiParam {String} courses.chapters.video 视屏名称
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 课程信息
* @apiSuccess {Number} data.id 课程ID
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.put('/:id', async (ctx, next) => {
	const data = ctx.request.body;
	const id = ctx.params.id;
	const mainData = {};
	const dataKeys = Object.keys(data);
	[ 'title', 'image', 'teacher', 'teacherDesc' ].map(key => {
		if (dataKeys.indexOf(key) > -1) {
			mainData[key] = data[key];
		}
	});
	const timestamp = Date.now();
	if (dataKeys.indexOf('coursetypeId')) {
		const courseType = await CourseTypes.findOne({ where: { id: data.coursetypeId } });
		if (courseType) {
			mainData.coursetypeId = data.coursetypeId;
			mainData.coursetypeName = courseType.name;
		}
	}
	// 更新主数据
	await CourseMain.update(mainData, { where: { id } });

	if (dataKeys.indexOf('courses') > -1) {
		for (let courseInfo of data.courses) {
			// 更新已存在的章节
			if (courseInfo.id) {
				await Courses.update({
					timestamp,
					title: courseInfo.title,
					sequence: courseInfo.sequence
				}, { where: { id: courseInfo.id } });

				// 更新节
				for (let chapterInfo of courseInfo.chapters) {
					if (chapterInfo.id) {
						await Chapters.update({
							timestamp,
							title: chapterInfo.title,
							sequence: chapterInfo.sequence,
							video: chapterInfo.video
						}, { where: { id: chapterInfo.id } });
					} else {
						await Chapters.create({
							timestamp,
							title: chapterInfo.title,
							sequence: chapterInfo.sequence,
							video: chapterInfo.video,
							coursemainId: id,
							courseId: courseInfo.id
						});
					}
				}
			} else {
				// 新建章节
				let course = await Courses.create({
					title: courseInfo.title,
					sequence: courseInfo.sequence,
					timestamp,
					coursemainId: id
				});

				for (let chapterInfo of course.chapters) {
					await Chapters.create({
						timestamp,
						title: chapterInfo.title,
						sequence: chapterInfo.sequence,
						video: chapterInfo.video,
						coursemainId: id,
						courseId: courseInfo.id
					});
				}
			}
		}
	}
	ctx.body = ResService.success({ id });
	await next();
});

/**
* @api {get} /api/courses?limit=&page=&keywords=&title=&startDay=&endDay=coursetypeId=&status=获取课程详情信息
* @apiName course-detail
* @apiGroup 课程管理
* @apiDescription 获取课程详情
* @apiHeader {String} authorization 登录token
* @apiParam {Number} [page] 当前页码，默认1
* @apiParam {Number} [limit] 每页条数，默认10
* @apiParam {String} [keywords] 关键字，可以按照关键字查询
* @apiParam {Number} [status] 课程状态 1-已上线课程 2-已下线课程，默认查询所有状态课程
* @apiParam {Date} [startDay] 创建时间开始日期，例如 2019-09-03
* @apiParam {Date} [endDay] 创建时间结束日期，例如 2019-09-03
* @apiParam {Date} [coursetypeId] 课程类型ID
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data 课程详情数据
* @apiSuccess {Number} data.count 总共课程条数
* @apiSuccess {Object[]} data.rows 当前页课程列表
* @apiSuccess {Number} data.rows.id 课程ID
* @apiSuccess {String} data.rows.title 课程标题
* @apiSuccess {Number} data.rows.coursetypeId 课程类型ID
* @apiSuccess {String} data.rows.coursetypeName课程类型名称
* @apiSuccess {String} data.rows.image 封面图片名称
* @apiSuccess {String} data.rows.teacher 主讲人
* @apiSuccess {String} data.rows.teacherDesc 主讲人简介
* @apiSuccess {String} data.rows.userId 创建人userId
* @apiSuccess {String} data.rows.userName 创建人姓名
* @apiSuccess {Number} data.rows.courseCount 当前课程总章节数目
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
		where[Op.or].push({ desc: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ teacher: { [Op.like]: `%${query.keywords}%` } });
		where[Op.or].push({ teacherDesc: { [Op.like]: `%${query.keywords}%` } });
	}
	if (keyMap.has('status')) where.status = Number(query.status);
	if (keyMap.has('startDate')) {
		let date = new Date(query.startDate);
		date.setHours(0, 0, 0, 0);
		if (!where.createdAt) where.createdAt = {};
		where.createdAt[Op.gte] = date;
	}
	if (keyMap.has('endDate')) {
		let date = new Date(query.endDate);
		date.setHours(23, 59, 59, 59);
		if (!where.createdAt) where.createdAt = {};
		where.createdA[Op.lte] = date;
	}
	if (keyMap.has('coursetypeId')) where.coursetypeId = query.coursetypeId;

	let courseMains = await CourseMain.findAndCountAll({ where, limit, offset });

	for (let courseMain of courseMains.rows) {
		let courseCount = await Courses.count({ where: { coursemainId: courseMain.id, timestamp: courseMain.timestamp } });
		let storeCount = await Stores.count({ where: { coursemainId: courseMain.id, status: 1 } });

		courseMain.courseCount = courseCount;
		courseMain.storeCount = storeCount;
	}
	ctx.body = ResService.success(courseMains);
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
* @apiSuccess {Number} data.coursetypeId 课程类型ID
* @apiSuccess {String} data.coursetypeName课程类型名称
* @apiSuccess {String} data.image 封面图片名称
* @apiSuccess {String} data.teacher 主讲人
* @apiSuccess {String} data.teacherDesc 主讲人简介
* @apiSuccess {String} data.userId 创建人userId
* @apiSuccess {String} data.userName 创建人姓名
* @apiSuccess {Object[]} data.courses 章节课程列表
* @apiSuccess {Number} data.courses.id 章ID
* @apiSuccess {Number} data.courses.sequence 章序号，比如 1表示第一章 2表示第二章 以此类推
* @apiSuccess {String} data.courses.title 章标题，比如第一章：武大校友会现状
* @apiSuccess {Object[]} data.courses.chapters 节列表
* @apiSuccess {Number} data.courses.chapters.id 节ID
* @apiSuccess {Number} data.courses.chapters.sequence 章节序号，1-表示 第一节课 2-第二节课
* @apiSuccess {String} data.courses.chapters.title 节标题
* @apiSuccess {String} data.courses.chapters.video 章节视屏名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/

router.get('/:id', async (ctx, next) => {
	const id = ctx.params.id;
	const courseMain = await Courses.findOne({ where: { id }, attributes: { exclude: [ 'status' ] } });
	if (!courseMain) {
		ctx.body = ResService.fail('无法获取课程详情');
		return;
	}
	const courses = [];
	const courseLists = await Courses.findAll({ where: { coursemainId: id } });

	for (let course of courseLists) {
		const chapters = await Chapters.findAll({ where: { courseId: course.id } });
		course.chapters = chapters;
		courses.push(course);
	}
	courseMain.courses = courses;

	ctx.body = ResService.success(courseMain);
	await next();
});

module.exports = router;
