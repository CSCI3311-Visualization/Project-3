import stackProcessing from './stackProcessing.js';

export default function lineChartD3(container) {
  // initialization
  // 1. Create a SVG with the margin convention
  const margin = { top: 20, right: 20, bottom: 20, left: 100 };
  const width = 1000 - margin.left - margin.right;
  const height = 1000 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // 2. Define scales using scaleTime() and scaleLinear()
  // Only specify ranges. Domains will be set in the 'update' function
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  // 4. Create axes containers
  const xAxis = d3.axisBottom().scale(xScale);
  let xAxisGroup = group.append('g').attr('class', 'x-axis axis');

  const yAxis = d3.axisLeft().scale(yScale);
  let yAxisGroup = group.append('g').attr('class', 'y-axis axis');

  function update(data, keys) {
    colorScale.domain(keys);

    console.log(keys);

    const obj = {};
    data.forEach((e) => {
      const year = e['funded_year'];
      const region = e['company_region'];
      if (keys.includes(region)) {
        // console.log('he');
        if (!obj[year]) {
          obj[year] = {};
        }
        if (obj[year][region] !== undefined) {
          obj[year][region] += e['raised_amount_usd'];
        } else {
          obj[year][region] = 0;
        }
      }
    });

    
    const objKeys = Object.keys(obj);
    objKeys.forEach((key) => {
      obj[key]['year'] = parseInt(key);
    });

    const arr = [];
    objKeys.forEach((key) => {
      arr.push(obj[key]);
    });

    const stack = d3
      .stack()
      .keys(keys)
      .value((datum, key) => {
        if (isNaN(datum[key])) {
          return 0;
        }
        return datum[key];
      })
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(arr);

    console.log(series);

    const area = d3
      .area()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const areas = group.selectAll('.area').data(series, (d) => d.key);

    areas
      .enter()
      .append('path')
      .attr('class', 'area')
      .merge(areas)
      .attr('d', area)
      .attr('fill', (d) => 'steelblue');

    areas.exit().remove();
  }

  return {
    update,
  };
}
