process.env.NODE_ENV = 'development';
const ResService = require('../core/ResService');
const { Op } = require('sequelize');
const Router = require('koa-router');
const Votes = require('../models/Votes');
const QueOptions = require('../models/QueOptions');

async function test (questionnaireId) {
	const options = await QueOptions.findAll({ where: { questionnaireId } });
	let ticketCount = 0; // 总票数
	let personCount = await Votes.count({ where: { questionnaireId } }); // 总投票人数
	let optionRes = [];
	for (let option of options) {
		console.log(`id: ${option.id}`);
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
		for (let i = 0, len = optionRes.length; i < len - 2; i++) {
			let item = optionRes[i];
			optionRes[i].percent = Number((item.count / ticketCount).toFixed(3));
			percentCount += item.percent;
		}
		optionRes[optionRes.length - 1].percent = 1 - percentCount;
	}
	const res = {
		ticketCount,
		personCount,
		options: optionRes
	};
	const fs = require('fs');
	fs.writeFileSync('./a.json', 'module.exports = ' + JSON.stringify(res));
	// console.log(JSON.stringify(res));
}

test(11).then();
