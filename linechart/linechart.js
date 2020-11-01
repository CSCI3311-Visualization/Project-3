import lineChartD3 from './lineChartD3.js';

d3.csv('investments.csv', d3.autoType).then((data) => {
  console.log('This is line chart', data);

  // Compute top 5 regions in 2014 YTD
  const regions = {};
  data.forEach((el) => {
    const cpRegion = el['company_region'];
    if (!cpRegion) return;

    const funded = el['raised_amount_usd'];
    const year = el['funded_year'];
    if (year === 2014) {
      if (regions[cpRegion]) {
        regions[cpRegion] += funded;
      } else {
        regions[cpRegion] = funded;
      }
    }
  });

  const keys = Object.keys(regions);
  // Sort by descending order
  keys.sort((a, b) => regions[b] - regions[a]);
  // console.log('keys', keys.slice(0, 5));
  // const mapped = keys.slice(0, 5).map((el) => [el, regions[el]]);
  // console.log('mapped', mapped);
  // // ["SF Bay Area", "New York City", "Boston", "Bangalore", "London"]

  const lineD3 = lineChartD3('.line-container');
  lineD3.update(data, keys.slice(0, 5));
});
