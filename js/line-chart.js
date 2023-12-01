class LineChart {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.revenueData = globalApplicationState.RevenueData;

    this.margin = { top: 30, right: 50, bottom: 70, left: 70 };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 450 - this.margin.top - this.margin.bottom;

    this.xScale = null;
    this.yScale = null;

    this.lineChart = d3.select('#graph2')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.legend = this.lineChart.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.width - 650}, 0)`); // Adjust the position of the legend


    this.initChart();

    this.displayRevenue(this.revenueData);
    this.createLegend();
  }

  initChart() {
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.xAxis.tickFormat(d3.format("d"));


    this.lineChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.height})`)
      .call(this.xAxis);

    this.lineChart
      .append("g")
      .attr("class", "y-axis");

    this.lineChart
      .append("text")
      .attr("class", "x-label")
      .attr("x", this.width / 2)
      .attr("y", this.height + 40)
      .style("text-anchor", "middle")
      .text("Year");

    this.lineChart
      .append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.height / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .text("Revenue (Billions)");

    this.verticalLine = this.lineChart
      .append("line")
      .attr("class", "vertical-line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", this.height)
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .style("display", "none");

    this.textGroup = this.lineChart.append("g").attr("class", "text-group");

    this.lines = [];
  }

  displayRevenue(inputData) {
    const line = d3.line()
      .x(d => this.xScale(+d.Year))
      .y(d => this.yScale(+d.Revenue_Billions));

    const dataGrouped = d3.group(inputData, d => d.StreamingPlatform);

    this.xScale.domain(d3.extent(inputData, d => +d.Year));
    this.yScale.domain([
      0,
      d3.max(inputData, d => +d.Revenue_Billions)
    ]);

    this.lineChart.select(".x-axis").call(this.xAxis);
    this.lineChart.select(".y-axis").call(d3.axisLeft(this.yScale));

    inputData.forEach(data => {
      data.Revenue_Billions = +data.Revenue_Billions;
    });

    const lineGroup = this.lineChart.append("g").attr("class", "line-group");
    this.lines.push(lineGroup);

    dataGrouped.forEach((platformData, StreamingPlatform) => {
      const linePath = lineGroup
        .append("path")
        .attr("class", "line-path")
        .datum(platformData)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", this.getRandomColor(StreamingPlatform))
        .style("stroke-width", "2px")
        .on("mouseover", (event, d) => {
          const tooltip = d3.select("#tooltip");

          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);

          tooltip.html(`<strong>${StreamingPlatform}</strong>`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          const tooltip = d3.select("#tooltip");

          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  }

  getRandomColor(d) {
    if (d === "Netflix") {
      return "#db0000";
    } else if (d === "Hulu") {
      return "#3dbb3d";
    } else if (d === "Disney+") {
      return "#393e8f";
    } else if (d === "PrimeVideo") {
      return "#00a8e1";
    }
  }
  createLegend() {
    const legendData = ["Netflix", "Hulu", "Disney+", "PrimeVideo"];

    const legendItems = this.legend.selectAll(".legend-item")
      .data(legendData)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => this.getRandomColor(d));

    legendItems.append("text")
      .attr("x", 15)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .text(d => d);
  }
}