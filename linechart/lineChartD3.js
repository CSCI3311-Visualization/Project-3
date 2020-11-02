export default function lineChartD3(container) {
  ///////// Initialization //////////
  // Create a SVG with the margin convention
  const margin = { top: 20, right: 100, bottom: 20, left: 100 };
  const width = 1100 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Define scales using scaleTime() and scaleLinear()
  // Only specify ranges. Domains will be set in the 'update' function
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  // Create axes containers
  const xAxis = d3.axisBottom().scale(xScale).ticks(10);
  let xAxisGroup = group.append('g').attr('class', 'x-axis axis');

  const yAxis = d3.axisLeft().scale(yScale);
  let yAxisGroup = group.append('g').attr('class', 'y-axis axis');

  //////// Clip Path /////////////
  group
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  function update(data, keys) {
    // Remove previous graphs for updae
    d3.selectAll('path').remove();
    d3.selectAll('circle').remove();

    // Set domain for xScale, yScale and colorScale
    xScale.domain([new Date(2004, 11), new Date(2014, 1)]);
    yScale.domain([0, d3.max(data, (d) => d.venture)]);
    colorScale.domain(keys);

    const lines = keys.map((key) => {
      return d3
        .line()
        .defined((d) => !isNaN(d[key]))
        .x((d) => xScale(d.date))
        .y((d) => yScale(d[key]));
    });

    const paths = lines.map((line, i) => {
      return group
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colorScale(keys[i]))
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);
    });

    paths.forEach((path, i) => {
      const totalLength = path.node().getTotalLength();

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    });

    // Update axes
    xAxisGroup
      .attr('transform', 'translate(0,' + height + ')')
      .transition()
      .duration(1000)
      .call(xAxis);
    yAxisGroup.transition().duration(1000).call(yAxis);

    ////// Tooltip /////
    const tooltip = d3.select('.line-tooltip');

    ////// Circles /////
    const circles = keys.map((key) => {
      return group
        .selectAll('data-circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'data-circle')
        .attr('r', (d) => {
          if (!d.date || !d[key]) return 0;
          return 7;
        })
        .attr('cx', (d) => {
          if (d.date === undefined || d.date === null) return 0;
          return xScale(d.date);
        })
        .attr('cy', (d) => {
          if (d[key] === undefined || d[key] === null) return 0;
          return yScale(d[key]);
        })
        .attr('fill', colorScale(key))
        .on('mouseenter', (e, d) => {
          const value = d[key];
          tooltip.html('Company: ' + key + '<br />' + 'Count: ' + value);
          const pos = d3.pointer(e, window);
          tooltip.style('top', pos[1] - 400 + 'px');
          tooltip.style('left', pos[0] + 'px');
          tooltip.style('display', 'block');
        })
        .on('mouseleave', () => {
          tooltip.style('display', 'none');
        });
    });
  }

  return {
    update,
  };
}
