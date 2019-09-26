const should = require('should');
const Companies = require('../../models/Companies');

describe('/api/companies', () => {
	let company;

	it('新增companys POST /api/companies', (done) => {
		Companies.destroy({ where: { name: '上海铭悦软件有限公司' } }).then(() => {
			process.request
				.post('/api/companies')
				.set('Authorization', process.token)
				.send({
					name: '上海铭悦软件有限公司',
					costcenter: '客户代码（财务编号）',
					provinceCode: '310000000000',
					cityCode: '310100000000',
					districtCode: '310113000000',
					street: '三门路569弄',
					email: 'liuzunkun@gmail.com',
					mainphone: '15618871298',
					zippostal: '200000',
					industryId: 1,
					industryName: '行业类型名称'
				})
				.expect(200)
				.end((err, res) => {
					should.not.exist(err);
					let resData = res.body;
					should.equal(resData.errcode, 0);
					company = resData.data;
					done();
				});
		});
	});

	it('重复新增companys POST /api/companies', (done) => {
		process.request
			.post('/api/companies')
			.set('Authorization', process.token)
			.send({
				name: '上海铭悦软件有限公司',
				costcenter: '客户代码（财务编号）',
				provinceCode: '310000000000',
				cityCode: '310100000000',
				districtCode: '310113000000',
				street: '三门路569弄',
				email: 'liuzunkun@gmail.com',
				mainphone: '15618871298',
				zippostal: '200000',
				industryId: 1,
				industryName: '行业类型名称'
			})
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				let resData = res.body;
				should.notEqual(resData.errcode, 0);
				done();
			});
	});
	it('查询company GET /api/companies/:id', (done) => {
		process.request
			.get(`/api/companies/${company.id}`)
			.set('Authorization', process.token)
			.expect(200)
			.end((err, res) => {
				should.not.exist(err);
				should.equal(res.body.errcode, 0);
				should.equal(res.body.data.mainphone, 15618871298);
				done();
			});
	});

	// it('修改company PUT /api/companies/:id', (done) => {
	// 	process.request
	// 		.put(`/api/companies/${company.id}`)
	// 		.set('Authorization', process.token)
	// 		.send({
	// 			// name: '上海铭悦软件有限公司',
	// 			costcenter: '成本中心2',
	// 			address: '上海市三门路561号',
	// 			apcompanycode: 'T20190710',
	// 			email: 'liuzunkun@gmail.com',
	// 			mainphone: '15618871298',
	// 			shortname: '铭悦软件',
	// 			zippostal: '200000',
	// 			site: 'liuzunkun.com',
	// 			industryId: 2,
	// 			status: 2
	// 		})
	// 		.expect(200)
	// 		.end(async (err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body;
	// 			should.equal(resData.errcode, 0);

	// 			let _company = await Companies.findOne({ where: { id: company.id } });
	// 			should.equal(_company.name, '上海铭悦软件有限公司');
	// 			done();
	// 		});
	// });

	// it('查询company列表 GET /api/companies?limit=10&page=1&name=&industryId=', (done) => {
	// 	process.request
	// 		.get('/api/companies?limit=10&page=1&name=mingyue')
	// 		.set('Authorization', process.token)
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			should.exist(res.body.data.count);
	// 			should.exist(res.body.data.rows);
	// 			done();
	// 		});
	// });

	// it('设置客户经理 POST /api/personnels/kam', (done) => {
	// 	process.request
	// 		.post('/api/personnels/kam')
	// 		.set('Authorization', process.token)
	// 		.send({
	// 			companyId: company.id,
	// 			userIds: [ '332934059962', '33296143733440' ]
	// 		})
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body.data;
	// 			should.exist(Array.isArray(resData));
	// 			should.equal(resData.length, 2);
	// 			done();
	// 		});
	// });

	// it('获取客户经理 GET /api/personnels/kam', (done) => {
	// 	process.request
	// 		.get('/api/personnels/kam?companyId=' + company.id)
	// 		.set('Authorization', process.token)
	// 		.expect(200)
	// 		.end((err, res) => {
	// 			should.not.exist(err);
	// 			let resData = res.body.data;
	// 			should.exist(Array.isArray(resData));
	// 			should.equal(resData.length, 2);
	// 			done();
	// 		});
	// });
});
