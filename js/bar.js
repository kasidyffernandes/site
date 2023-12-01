//https://dataviz.unhcr.org/tools/d3/d3_grouped_bar_chart.html
class BarChart{
    constructor(globalApplicationState){
        this.globalApplicationState = globalApplicationState

        this.showData = globalApplicationState.showData
        this.revenuData = globalApplicationState.revenuData
        console.log(globalApplicationState.testData)

        let margin = {top:30, right:30, bottom:30, left:30},
            width = 800 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
        
        this.barChart = d3.select('#barchart').append('svg')
            .attr('width', width+margin.left+margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', "translate("+margin.left+","+margin.top+")");  
        this.testData = globalApplicationState.testData
        console.log(this.showData)

        var subgroups = this.testData.columns.slice(1)
        console.log(subgroups)

        var groups = d3.map(this.testData, function(d){return(d.age)})
        console.log(groups)
        var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
 
    this.barChart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));
    
      var y = d3.scaleLinear()
      .domain([0, 1100])
      .range([ height, 0 ]);
      this.barChart
      .append("text")
      .attr("class", "x-label")
      .attr("x", width / 2)
      .attr("y", height + 20)
      .style("text-anchor", "middle")
      .text("Ages");
  
    this.barChart.append("g")
      .call(d3.axisLeft(y));
      var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05])

      var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#db0000','#3dbb3d','#393e8f', '#00a8e1'])
      this.barChart.append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(this.testData)
      .enter()
      .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.age) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); });
        this.barChart.append("rect").attr("x",15).attr("y",0).attr("width", 10).attr("height", 10).style("fill", "#db0000")
        this.barChart.append("rect").attr("x",15).attr("y",25).attr("width", 10).attr("height", 10).style("fill", "#3dbb3d")
        this.barChart.append("rect").attr("x",15).attr("y",50).attr("width", 10).attr("height", 10).style("fill", "#393e8f")
        this.barChart.append("rect").attr("x",15).attr("y",75).attr("width", 10).attr("height", 10).style("fill", "#00a8e1")
        this.barChart.append("text").attr("x", 30).attr("y", 5).text("Netflix").style("font-size", "13px").attr("alignment-baseline","middle")
        this.barChart.append("text").attr("x", 30).attr("y", 30).text("Hulu").style("font-size", "13px").attr("alignment-baseline","middle")
        this.barChart.append("text").attr("x", 30).attr("y", 55).text("Disney").style("font-size", "13px").attr("alignment-baseline","middle")
        this.barChart.append("text").attr("x", 30).attr("y", 80).text("Prime").style("font-size", "13px").attr("alignment-baseline","middle")
        
  
            //var x = this.showData.filter(function(d){return d.Type == '0'})


  
            }

}