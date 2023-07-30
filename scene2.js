async function initScene2() {
    // Load data from CSV file
    const data = await d3.csv('gasprice_states.csv', function (d) {
      return {
        year: +d.year,
        state: d.state,
        price: +d.price
      };
    });
  
    // Set up SVG container
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;
  
    const svg = d3.select('.chart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  
    const chart = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    // Create scales for x and y axes
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.state))
      .range([0, chartWidth])
      .paddingInner(0.3);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([chartHeight, 0]);
  
    // Create and style bars
    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.state))
      .attr('y', d => yScale(d.price))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.price))
      .attr('fill', 'steelblue')
      .on('mouseover', function (event, d) {
        // Show tooltip on mouseover
        const tooltip = chart.append('g')
          .attr('class', 'tooltip')
          .style('pointer-events', 'none');
  
        const tooltipText = `$${d.price.toFixed(2)}`;
        const tooltipTextWidth = 100; // Adjust the width of the tooltip text box
  
        // Determine tooltip positioning based on the mouse position
        const tooltipX = event.pageX - tooltipTextWidth / 2;
        const tooltipY = event.pageY - 50; // Adjust this value for desired vertical offset
  
        tooltip.append('rect')
          .attr('x', tooltipX)
          .attr('y', tooltipY)
          .attr('width', tooltipTextWidth)
          .attr('height', 35) // Adjust the height of the tooltip text box
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1);
  
        tooltip.append('text')
          .attr('x', tooltipX + tooltipTextWidth / 2)
          .attr('y', tooltipY + 20) // Adjust this value for vertical text centering
          .attr('fill', 'red')
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .html(tooltipText);

          tooltip.raise();
      })
      .on('mouseout', function () {
        // Remove tooltip on mouseout
        chart.select('.tooltip').remove();
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
      .text('Major US States');
  
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
  
    // Slider functionality
    const yearSlider = document.getElementById('year-slider');
    const selectedYear = document.getElementById('selected-year');
  
    yearSlider.addEventListener('input', function () {
      const year = yearSlider.value;
      selectedYear.textContent = year;
      updateChart(+year);
    });
  
    function updateChart(selectedYear) {
      const filteredData = data.filter(d => d.year === selectedYear);
  
      yScale.domain([0, d3.max(filteredData, d => d.price)]);
      yAxisGroup.transition().call(d3.axisLeft(yScale));
  
      chart.selectAll('.bar')
        .data(filteredData)
        .transition()
        .attr('y', d => yScale(d.price))
        .attr('height', d => chartHeight - yScale(d.price));
    }
  
    // Initialize the chart with the default selected year
    updateChart(+yearSlider.value);
  }