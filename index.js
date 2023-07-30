async function initScene1() {
  // Load data from CSV file
  const data = await d3.csv('gasprice_year.csv', function (d) {
    return {
      year: +d.year,
      price: +d.price
    };
  });

  
  // Set up SVG container
  const svgWidth = 800;
  const svgHeight = 500; // Increased height to accommodate axis labels
  const margin = { top: 20, right: 20, bottom: 50, left: 60 }; // Increased bottom margin for x-axis label
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const svg = d3.select('.chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const chart = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Create scales for x and y axes
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year)) // Use all years in the data
    .range([0, chartWidth])
    .paddingInner(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, 5]) // Set y-axis scale from 0 to 5
    .range([chartHeight, 0]);

  // Create and style line
  const line = d3.line()
    .x(d => xScale(d.year) + xScale.bandwidth() / 2)
    .y(d => yScale(d.price));

  chart.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add circles at data points with tooltips
  const tooltipGroup = chart.append('g'); // Create a group for tooltips
  const circles = chart.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.price))
    .attr('r', 4)
    .attr('fill', 'darkblue')
    .on('mouseover', function (event, d) {
      // Show tooltip on mouseover
      tooltipGroup.append('text')
        .attr('x', xScale(d.year) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.price) - 10)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(`$${d.price.toFixed(2)}`);
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
              .attr('y', 40) // Increased y position for more space
              .attr('fill', 'black')
              .attr('text-anchor', 'middle')
              .attr('font-size', '14px') // Increase font size for x-axis label
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
    .attr('font-size', '14px') // Increase font size for y-axis label
    .text('Gasoline Retail Prices (Dollars per Gallon)');

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
    .attr('y', d => yScale(data.find(item => item.year === d.year).price) - 85)
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
    .attr('y1', d => yScale(data.find(item => item.year === d.year).price) - 80)
    .attr('x2', d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr('y2', d => yScale(data.find(item => item.year === d.year).price) - 5)
    .attr('stroke', 'purple')
    .attr('stroke-width', 2);

}
