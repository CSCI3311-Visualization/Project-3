import stackChartD3 from './stackChartD3.js';
import dataProcessor from './dataProcessor.js';

d3.csv('investments.csv', d3.autoType).then((data) => {
  console.log('This is line chart', data);

  // Compute top 5 regions in 2014 YTD
  const regions = dataProcessor.topFive(data, 'company_region');
  const topRegions = Object.keys(regions);
  topRegions.sort((a, b) => regions[b] - regions[a]);

  // Compute top 5 markets in 2014 YTD
  const markets = dataProcessor.topFive(data, 'company_market');
  const topMarkets = Object.keys(markets);
  topMarkets.sort((a, b) => markets[b] - markets[a]);

  let measureType = 'company_region';
  const stackD3 = stackChartD3('.stack-container');

  d3.select('#stack-group-by').on('change', (e) => {
    measureType = e.target.value;
    if (measureType === 'market') {
      stackD3.update(data, topMarkets.slice(0, 5), 'company_market');
    } else {
      stackD3.update(data, topRegions.slice(0, 5), 'company_region');
    }
  });

  stackD3.update(data, topRegions.slice(0, 5), 'company_region');
});
