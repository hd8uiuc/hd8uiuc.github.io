// example.js

async function init() {
    // Load data from CSV file
    const data = await d3.csv('gasprice_year.csv', function(d) {
      return {
        year: +d.year,
        price: +d.price
      };
    });
  
    // Set up SVG container
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
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
      .domain([0, d3.max(data, d => d.price)])
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
  
    // Add circles at data points
    chart.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.price))
      .attr('r', 4)
      .attr('fill', 'steelblue');
  
    // Add x-axis
    chart.append('g')
      .attr('transform', 'translate(0,' + chartHeight + ')')
      .call(d3.axisBottom(xScale));
  
    // Add y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale));
  }
  