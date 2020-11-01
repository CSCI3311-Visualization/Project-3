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
    console.log(keys);

    // const timeFilter = data.filter((el) => {
    //   +el['funded_month'] < +new Date(2014, 1);
    // });

    // console.log('timeFilter', timeFilter);

    const filtered = data.filter((el) => el['company_region'] === keys[0]);
    const sumstat = d3.group(filtered, (d) => +d['funded_year']);
    const sums = d3.max(sumstat, (d) => {
      return d3.sum(d[1], (a) => a['raised_amount_usd']);
    });

    // 1. Update the domains of the scales
    xScale.domain([new Date(2004, 11), new Date(2014, 12)]);

    // d3.max(data, (d) => d['funded_month'])]);
    yScale.domain([0, sums]);
    colorScale.domain(keys);

    const lines = keys.map((e) => {
      const category = data.filter((el) => el['company_region'] === e);
      const grouped = d3.group(category, (d) => +d['funded_year']);

      // 2. Create lines
      const line = d3
        .line()
        .x(function (d) {
          console.log('year', d[0]);
          return xScale(new Date(d[0], 1));
        })
        .y(function (d) {
          let sum = d3.sum(d[1], (da) => da['raised_amount_usd']);
          // console.log(e + ' hello ' + sum);
          return yScale(sum);
        });

      group
        .append('path')
        .datum(grouped)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', colorScale(e))
        .attr('stroke-width', 3)
        // .attr('stroke-linejoin', 'round')
        // .attr('stroke-linecap', 'round')
        .on('click', () => {
          console.log('yoyo', e);
        })
        .attr('d', line);

      return line;
    });

    console.log('line array', lines);

    // 6. Update axes
    xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(xAxis);
    yAxisGroup.call(yAxis);

    console.log('end of lineD3');
  }

  return {
    update,
  };
}
