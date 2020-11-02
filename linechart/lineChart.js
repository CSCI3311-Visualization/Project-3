import lineChartD3 from './lineChartD3.js';

d3.csv('rounds.csv', d3.autoType).then((data) => {
  console.log('rounds.csv', data);

  ////// YEAR
  const obj = {};
  data.forEach((element) => {
    const year = element['funded_year'];
    if (!year || year === 2015) return;
    if (obj[year] === undefined) {
      obj[year] = {};
    }
    const fundType = element['funding_round_type'];
    if (!obj[year][fundType]) {
      obj[year][fundType] = 0;
    }
    obj[year][fundType] += 1;
  });

  console.log('obj', obj);
  const keys = Object.keys(obj);
  console.log('keys', keys);

  keys.forEach((el) => {
    const date = new Date(el, 1, 1);
    obj[el]['date'] = date;
  });

  console.log(obj);

  const mapped = keys.map((el) => obj[el]);
  console.log('mapped', mapped);

  const lineD3 = lineChartD3('.line-chart-container');
  lineD3.update(mapped, [
    // 'venture',
    // 'angel',
    // 'seed',
    // 'private_equity',
    'equity_crowdfunding',
    // 'debt_financing',
  ]);
});
