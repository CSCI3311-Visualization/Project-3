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

  // Create a category label (tooltip)
  const tooltip = svg
    .append('text')
    .attr('class', 'tooltip')
    .style('font-weight', 'bold')
    .attr('x', 110)
    .attr('y', 30)
    .style('text-anchor', 'start');

  //////// Clip Path /////////////
  group
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  /////////// BRUSH ///////////
  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on('end', brushed);

  group.append('g').attr('class', 'brush').call(brush);

  function brushed(event) {
    if (!event || !event.sourceEvent) return null;
    if (event.selection) {
      const inverted = event.selection.map(xScale.invert);
      console.log('inverted', inverted);
      xDomain = inverted;
      update(_data, _keys);
    } else {
      xDomain = [new Date(2004, 11), new Date(2014, 1)];
      update(_data, _keys);
    }
  }

  let _data;
  let _keys;
  let xDomain;

  function update(data, keys) {
    if (xDomain) {
      group.select('.brush').call(brush.move, null);
      console.log('eer');
    }
    _data = data;
    _keys = keys;
    // Process data into D3 stack format
    const stackProcessedData = stackProcessing(data, keys);

    // Create stack layout (Ascending order)
    const stack = d3
      .stack()
      .keys(keys)
      .value((datum, key) => {
        if (isNaN(datum[key])) {
          return 0;
        }
        return datum[key];
      })
      .order(d3.stackOrderAscending)
      .offset(d3.stackOffsetNone);

    // Call layout
    const series = stack(stackProcessedData);

    // Set domain for xScale, yScale and colorScale
    xScale.domain(xDomain ? xDomain : [new Date(2004, 11), new Date(2014, 1)]);
    yScale.domain([0, 12000000000]);
    colorScale.domain(keys);

    const area = d3
      .area()
      .x((d) => xScale(new Date(d.data.time)))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const areas = group.selectAll('.area').data(series, (d) => d.key);

    areas
      .enter()
      .append('path')
      .style('clip-path', 'url(#clip)')
      .attr('class', 'area')
      .merge(areas)
      .attr('d', area)
      .attr('fill', (d) => colorScale(d.key))
      .on('mouseover', (e, d) => {
        tooltip.text(d.key);
      })
      .on('mouseout', () => {
        tooltip.text('');
      });

    areas.exit().remove();

    // Update axes
    xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(xAxis);
    yAxisGroup.call(yAxis);
  }

  return {
    update,
  };
}
