const Router = require('koa-router');
const multer = require('koa-multer');
const ResService = require('../core/ResService');
const jwt = require('jsonwebtoken');
const config = require('../config');

const videoStorage = multer.diskStorage({
	// 视屏保存路径
	destination: (req, file, cb) => {
		cb(null, config.videoPath);
	},
	// 修改文件名称
	filename: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
	}
});
const imageStorage = multer.diskStorage({
	// 图片保存路径
	destination: (req, file, cb) => {
		cb(null, config.imagePath);
	},
	// 修改文件名称
	filename: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
	}
});

// 加载配置
const videoUpload = multer({ storage: videoStorage, limits: { fileSize: '300M', files: 1 } });
const imageUpload = multer({
	storage: imageStorage,
	limits: { fileSize: '100M', files: 1 },
	fileFilter: (req, file, cb) => {
		const fileFormat = (file.originalname).split('.'); // 以点分割成数组，数组的最后一项就是后缀名
		const ext = (fileFormat[fileFormat.length - 1] || '').toLowerCase();

		let isLeagal = [ 'jpg', 'jpeg', 'png' ].indexOf(ext) > -1;
		if (isLeagal) {
			cb(null, true);
		} else {
			cb(new Error('必须上传 .jpg 或 .png 格式的图片'));
		}
	}
});

const router = new Router();

router.prefix('/api/files');

/**
* @api {post} /api/files/video 上传视屏
* @apiName video-upload
* @apiGroup 文件
* @apiHeader {String} authorization 登录token Bearer + token
* @apiDescription 上传视屏文件
* @apiParam  {File} file 文件信息
* @apiSuccess {Object} data 返回数据
* @apiSuccess {String} data.name 返回文件名称
* @apiSuccess {Number} errcode 成功为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/video', videoUpload.single('file'), async (ctx, next) => {
	let user = jwt.decode(ctx.header.authorization.substr(7));
	const fileInfo = ctx.req.file;
	if (!user || !user.userId) {
		ctx.body = ResService.fail('鉴权失败');
		return;
	}

	try {
		ctx.body = ResService.success({ name: fileInfo.filename });
	} catch (error) {
		console.log('上传文件失败', error);
		ctx.body = ResService.fail('上传文件失败');
		next();
	}
});

/**
* @api {post} /api/files/images 上传图片
* @apiName file-images
* @apiGroup 文件
* @apiHeader {String} authorization 登录token Bearer + token
* @apiDescription 上传图片
* @apiParam  {File} file 文件信息
* @apiSuccess {Object} data 返回值
* @apiSuccess {Number} errcode 成功为0
* @apiSuccess {Object} data {} 图片信息
* @apiSuccess {String} data.name  图片名称
* @apiError {Number} errcode 失败不为0
* @apiError {Number} errmsg 错误消息
*/
router.post('/image', imageUpload.single('image'), async (ctx, next) => {
	const imageInfo = ctx.req.image;
	let user = jwt.decode(ctx.header.authorization.substr(7));

	if (!user || !user.userId) {
		ctx.body = ResService.fail('鉴权失败');
		return;
	}

	ctx.body = ResService.success({ name: imageInfo.filename });
	next();
});

module.exports = router;
