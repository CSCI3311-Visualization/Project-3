import lineChartD3 from './lineChartD3.js';

d3.csv('rounds.csv', d3.autoType).then((data) => {
  ////// Data Processing By Year
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

  const keys = Object.keys(obj);

  keys.forEach((el) => {
    const date = new Date(el, 1, 1);
    obj[el]['date'] = date;
  });

  const processedData = keys.map((el) => obj[el]);
  console.log('processedData', processedData);

  let fundTypes = [
    'venture',
    'angel',
    'seed',
    'private_equity',
    'equity_crowdfunding',
    'debt_financing',
  ];

  const lineD3 = lineChartD3('.line-chart-container');
  lineD3.update(processedData, fundTypes);

  fundTypes.forEach((fundType) => {
    d3.select('#form-container')
      .append('input')
      .attr('type', 'checkbox')
      .attr('class', 'checkbox')
      .attr('id', fundType)
      .attr('value', fundType)
      .attr('checked', 'true');

    d3.select('#form-container')
      .append('label')
      .attr('for', fundType)
      .text(fundType);
  });

  /// Event Listener
  document.querySelectorAll('.checkbox').forEach((e) => {
    e.addEventListener('change', function () {
      if (this.checked) {
        fundTypes.push(this.value);
        lineD3.update(processedData, fundTypes);
        console.log('true');
      } else {
        fundTypes = fundTypes.filter((e) => e !== this.value);
        lineD3.update(processedData, fundTypes);
        console.log('false');
      }
    });
  });
});
