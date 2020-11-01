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
    let stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    
  }

  return {
    update,
  };
}
