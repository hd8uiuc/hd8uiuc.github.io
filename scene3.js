// Load data from CSV file
async function initScene3() {
  const data = await d3.csv('gasinv_year.csv', function (d) {
    return {
      year: +d.year,
      consumed: +d.consumed,
      gas_supply: +d.gas_supply
    };
  });

  // Set up SVG container
  const svgWidth = 800;
  const svgHeight = 500;
  const margin = { top: 50, right: 50, bottom: 80, left: 80 }; // Increased bottom and left margin for axis labels
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const svg = d3.select('.chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const chart = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Create scales for x and y axes
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, chartWidth])
    .paddingInner(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.consumed, d.gas_supply))])
    .range([chartHeight, 0]);

  // Create and style lines
  const lineConsumed = d3.line()
    .x(d => xScale(d.year) + xScale.bandwidth() / 2)
    .y(d => yScale(d.consumed));

  const lineGasSupply = d3.line()
    .x(d => xScale(d.year) + xScale.bandwidth() / 2)
    .y(d => yScale(d.gas_supply));

  // Add tooltip group
  const tooltipGroup = chart.append('g');

  // Append lines for data before 2023
  chart.append('path')
    .datum(data.filter(d => d.year <= 2022))
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('d', lineConsumed);

  chart.append('path')
    .datum(data.filter(d => d.year <= 2022))
    .attr('fill', 'none')
    .attr('stroke', 'brown')
    .attr('stroke-width', 2)
    .attr('d', lineGasSupply);

  // Append dotted lines for data between 2022 and 2023
  chart.append('path')
    .datum(data.filter(d => d.year >= 2022 && d.year <= 2023))
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-dasharray', '3 3') // Dotted line style
    .attr('stroke-width', 2)
    .attr('d', lineConsumed);

  chart.append('path')
    .datum(data.filter(d => d.year >= 2022 && d.year <= 2023))
    .attr('fill', 'none')
    .attr('stroke', 'brown')
    .attr('stroke-dasharray', '3 3') // Dotted line style
    .attr('stroke-width', 2)
    .attr('d', lineGasSupply);

  // Append dotted lines for data between 2023 and 2024
  chart.append('path')
    .datum(data.filter(d => d.year >= 2023 && d.year <= 2024))
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-dasharray', '3 3') // Dotted line style
    .attr('stroke-width', 2)
    .attr('d', lineConsumed);

  chart.append('path')
    .datum(data.filter(d => d.year >= 2023 && d.year <= 2024))
    .attr('fill', 'none')
    .attr('stroke', 'brown')
    .attr('stroke-dasharray', '3 3') // Dotted line style
    .attr('stroke-width', 2)
    .attr('d', lineGasSupply);

  // Add circular points for each year on the lines (up to and including 2022)
  const circleDataUpTo2022 = data.filter(d => d.year <= 2022);
  chart.selectAll('circle.consumed')
    .data(circleDataUpTo2022)
    .enter()
    .append('circle')
    .attr('class', 'consumed')
    .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.consumed))
    .attr('r', 4)
    .attr('fill', 'darkgreen')
    .on('mouseover', function (event, d) {
      tooltipGroup.append('text')
        .attr('x', xScale(d.year) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.consumed) - 10)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(`${d.consumed} MMbpd`);
    })
    .on('mouseout', function () {
      tooltipGroup.selectAll('text').remove();
    });

  chart.selectAll('circle.gas_supply')
    .data(circleDataUpTo2022)
    .enter()
    .append('circle')
    .attr('class', 'gas_supply')
    .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.gas_supply))
    .attr('r', 4)
    .attr('fill', 'brown')
    .on('mouseover', function (event, d) {
      // Show tooltip on mouseover
      tooltipGroup.append('text')
        .attr('x', xScale(d.year) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.gas_supply) - 10)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(`${d.gas_supply} MMbpd`);
    })
    .on('mouseout', function () {
      // Remove tooltip on mouseout
      tooltipGroup.selectAll('text').remove();
    });

  // Add circular points for each year on the lines (after 2022) with reduced opacity for dotted appearance
  const circleDataAfter2022 = data.filter(d => d.year > 2022);

  chart.selectAll('circle.consumed-after')
    .data(circleDataAfter2022)
    .enter()
    .append('circle')
    .attr('class', 'consumed-after')
    .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.consumed))
    .attr('r', 4)
    .attr('fill', 'darkgreen')
    .attr('opacity', 0.5) // Reduce opacity for dotted circles
    .on('mouseover', function (event, d) {
      tooltipGroup.append('text')
        .attr('x', xScale(d.year) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.consumed) - 10)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(`${d.consumed} MMbpd`);
    })
    .on('mouseout', function () {
      // Remove tooltip on mouseout
      tooltipGroup.selectAll('text').remove();
    });

  chart.selectAll('circle.gas_supply-after')
    .data(circleDataAfter2022)
    .enter()
    .append('circle')
    .attr('class', 'gas_supply-after')
    .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.gas_supply))
    .attr('r', 4)
    .attr('fill', 'brown')
    .attr('opacity', 0.5) // Reduce opacity for dotted circles
    .on('mouseover', function (event, d) {
      // Show tooltip on mouseover
      tooltipGroup.append('text')
        .attr('x', xScale(d.year) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.gas_supply) - 10)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(`${d.gas_supply} MMbpd`);
    })
    .on('mouseout', function () {
      // Remove tooltip on mouseout
      tooltipGroup.selectAll('text').remove();
    });

  // Add x-axis with label
  const xAxisGroup = chart.append('g')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(d3.axisBottom(xScale));

  xAxisGroup.selectAll('path').attr('stroke-width', '2').attr('stroke', 'black');
  xAxisGroup.selectAll('line').attr('stroke-width', '2').attr('stroke', 'black');

  xAxisGroup.append('text') // X-axis label
    .attr('x', chartWidth / 2)
    .attr('y', 40)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('Year');

  // Add y-axis with label
  const yAxisGroup = chart.append('g')
    .call(d3.axisLeft(yScale));

  yAxisGroup.selectAll('path').attr('stroke-width', '2').attr('stroke', 'black');
  yAxisGroup.selectAll('line').attr('stroke-width', '2').attr('stroke', 'black');

  yAxisGroup.append('text') // Y-axis label
    .attr('transform', 'rotate(-90)')
    .attr('x', -chartHeight / 2)
    .attr('y', -50)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('Million barrels per day');

  // Add legends
  const legendWidth = 80;
  const legendHeight = 12;
  const legendSpacing = 110; // Increase spacing between the legends

  // Brown legend for Consumption
  const legendConsumption = chart.append('g')
    .attr('transform', `translate(${(chartWidth - (2 * legendWidth) - legendSpacing) / 2}, ${chartHeight + 60})`);

  legendConsumption.append('rect')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'brown');

  legendConsumption.append('text')
    .attr('x', legendWidth + 5)
    .attr('y', legendHeight / 2)
    .attr('fill', 'black')
    .attr('font-size', '12px')
    .attr('alignment-baseline', 'middle')
    .text('Domestic Supply');

  // Green legend for Domestic Supply
  const legendDomesticSupply = chart.append('g')
    .attr('transform', `translate(${(chartWidth + legendSpacing) / 2}, ${chartHeight + 60})`);

  legendDomesticSupply.append('rect')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'green');

  legendDomesticSupply.append('text')
    .attr('x', legendWidth + 5)
    .attr('y', legendHeight / 2)
    .attr('fill', 'black')
    .attr('font-size', '12px')
    .attr('alignment-baseline', 'middle')
    .text('Domestic Consumption');

// Add annotations for specific years
const annotations = [
  {
    year: 2008,
    label: 'Great Recession'
  },
  {
    year: 2011,
    label: 'N.Africa and Middle East crisis'
  },
  {
    year: 2020,
    label: 'Covid-19 Pandemic'
  }
];

const lineGroup = chart.append('g'); // Create a group for lines

chart.selectAll('.annotation-text')
  .data(annotations)
  .enter()
  .append('text')
  .attr('class', 'annotation-text')
  .attr('x', d => xScale(d.year) + xScale.bandwidth() / 2)
  .attr('y', d => yScale(data.find(item => item.year === d.year).consumed) + 60)
  .attr('fill', 'purple')
  .attr('text-anchor', 'middle')
  .attr('font-size', '12px')
  .attr('font-weight', 'bold')
  .text(d => d.label);

// Add lines connecting annotations to data points
chart.selectAll('.annotation-line')
  .data(annotations)
  .enter()
  .append('line')
  .attr('class', 'annotation-line')
  .attr('x1', d => xScale(d.year) + xScale.bandwidth() / 2)
  .attr('y1', d => yScale(data.find(item => item.year === d.year).consumed) + 50)
  .attr('x2', d => xScale(d.year) + xScale.bandwidth() / 2)
  .attr('y2', d => yScale(data.find(item => item.year === d.year).consumed) + 5)
  .attr('stroke', 'purple')
  .attr('stroke-width', 2);


}
