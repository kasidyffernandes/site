class MainGraph{
    constructor(globalApplicationState){
        this.globalApplicationState = globalApplicationState

        this.showData = globalApplicationState.showData
        this.revenuData = globalApplicationState.revenuData
        var yval = document.querySelector('.yaxis').value;
 

        let margin = {top:30, right:30, bottom:70, left:70},
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        
        this.mainGraph = d3.select('#graph1').append('svg')
            .attr('width', width+margin.left+margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', "translate("+margin.left+","+margin.top+")");

       
            this.x = this.showData.filter(function(d){return d.Type == '0'})
     
            var nc = this.x.filter(d=> d.Netflix == 1).length
            d3.select('#ncount').html(nc)
            var hc = this.x.filter(d=> d.Hulu == 1).length
            d3.select('#hcount').html(hc)
            var dc = this.x.filter(d=> d.Disney == 1).length
            d3.select('#dcount').html(dc)
            var pc = this.x.filter(d=> d.Prime == 1).length
            d3.select('#pcount').html(pc)

            this.xScale = d3.scaleLinear().range([0, width]).domain(d3.extent(this.x, d=>d.Year));
            this.xAxis = this.mainGraph.append('g').attr('transform', "translate(0,"+ height+")").call(d3.axisBottom(this.xScale).tickFormat(d3.format('d')));
           
  
            this.yScale = d3.scaleLinear().range([height, 0]).domain([0,100]);
            this.yAxis = this.mainGraph.append('g').call(d3.axisLeft(this.yScale));
            this.mainGraph
            .append("text")
            .attr("class", "x-label")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .style("text-anchor", "middle")
            .text("Year");

            this.mainGraph
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -30)
            .style("text-anchor", "middle")
            .text("Score");
           // console.log(this.yScale.range())
        
 
            let Tooltip = d3.select('#graph1').append('div').style('visbility', 'hidden').attr('class', 'tooltip')
            let brush = d3.brush()//.extent([[0,0], [800, 500]])
            .extent([[d3.min(this.xScale.range()), d3.min(this.yScale.range())], 
             [d3.max(this.xScale.range()), d3.max(this.yScale.range())]])
              .on("brush end", (event)=>{
                  if(event.selection === null){
                      globalApplicationState.list.updatetable(this.x)
                  }
                   const [[x0,y0], [x1,y1]] = event.selection;
                   //console.log(event.selection)
                

                  let brushedData = this.x.filter(d =>{
                    return x0< this.xScale(d.Year) 
                    && x1 >this.xScale(d.Year)
                    && y0 < this.yScale(d.RTScore)
                    && y1 > this.yScale(d.RTScore) 
                })
               // console.log(brushedData)
                globalApplicationState.list.updatetable(brushedData)
              })

            this.brushsvg =  this.mainGraph.append('g').attr('class', 'brush').call(brush)

           
            this.mainGraph.append('g').selectAll('dot')
                .data(this.x)
                .enter()
                .append('circle')
                    .attr('cx', (d)=> this.xScale(d.Year))
                    .attr('cy', (d)=> this.yScale(d.RTScore))
                    .attr('r', 3)
                    .style("fill", d=> this.colorScale(d))
                    .on('mouseover', function(d,i){
                        d3.select(this).attr('r', 5)
                        Tooltip.style('visibility', 'visible').style('position', 'absolute').html("Title: " + i.Title + "</br> Score: " + i.RTScore + "</br> Year: " + i.Year)
                    })
                    .on("mousemove", function(d){
                        Tooltip.style('top', d.pageY -10 + "px").style("left", d.pageX + 10 + "px");
                    })
                    .on('mouseout', function(d){
                        Tooltip.style("visibility", "hidden"); 
                        d3.select(this).attr('r', 3)
                    })
                    this.mainGraph.append("rect").attr("x",15).attr("y",0).attr("width", 5).attr("height", 5).style("fill", "#db0000")
                    this.mainGraph.append("rect").attr("x",15).attr("y",12).attr("width", 5).attr("height", 5).style("fill", "#3dbb3d")
                    this.mainGraph.append("rect").attr("x",15).attr("y",24).attr("width", 5).attr("height", 5).style("fill", "#393e8f")
                    this.mainGraph.append("rect").attr("x",15).attr("y",36).attr("width", 5).attr("height", 5).style("fill", "#00a8e1")
                    this.mainGraph.append("text").attr("x", 21).attr("y", 5).text("Netflix").style("font-size", "10px").attr("alignment-baseline","middle")
                    this.mainGraph.append("text").attr("x", 21).attr("y", 16).text("Hulu").style("font-size", "10px").attr("alignment-baseline","middle")
                    this.mainGraph.append("text").attr("x", 21).attr("y", 27).text("Disney").style("font-size", "10px").attr("alignment-baseline","middle")
                    this.mainGraph.append("text").attr("x", 21).attr("y", 40).text("Prime").style("font-size", "10px").attr("alignment-baseline","middle")
                    
              
            

    }

    colorScale(d) {
        if(d.Netflix== "1"){return "#db0000"}
        else if(d.Hulu == "1"){return "#3dbb3d"}
        else if(d.Disney == "1"){return "#393e8f"}
        else if(d.Prime == "1"){return "#00a8e1"}
    }
    clearBrush(){
        d3.selectAll('circle').attr('opacity', '0.6').transition()
        brushsvg.call(d3.brush)
    }

    updatecards(cdata){
        var nc = cdata.filter(d=> d.Netflix == 1).length
        d3.select('#ncount').html(nc)
        var hc = cdata.filter(d=> d.Hulu == 1).length
        d3.select('#hcount').html(hc)
        var dc = cdata.filter(d=> d.Disney == 1).length
        d3.select('#dcount').html(dc)
        var pc = cdata.filter(d=> d.Prime == 1).length
        d3.select('#pcount').html(pc)
    }
    updateTable(filteredData){
   
        var yval = document.querySelector('.yaxis').value;
        document.querySelector('.age').value;

   
        var nc = filteredData.filter(d=> d.Netflix == 1).length
        d3.select('#ncount').html(nc)
        var hc = filteredData.filter(d=> d.Hulu == 1).length
        d3.select('#hcount').html(hc)
        var dc = filteredData.filter(d=> d.Disney == 1).length
        d3.select('#dcount').html(dc)
        var pc = filteredData.filter(d=> d.Prime == 1).length
        d3.select('#pcount').html(pc)
       
        this.xScale.domain(d3.extent(filteredData, d=>d.Year))

        this.yScale.domain(d3.extent(filteredData, d=>d[yval]))
        this.xAxis.transition().duration(1000).call(d3.axisBottom(this.xScale).tickFormat(d3.format('d')))
        this.yAxis.transition().duration(1000).call(d3.axisLeft(this.yScale))
 
        let Tooltip = d3.select('#graph1').append('div').style('visbility', 'hidden').attr('class', 'tooltip')
       // console.log(d3.extent(this.yScale.range()))
       // console.log(d3.extent(this.xScale.range()))


        let brush = d3.brush()//.extent([[0,0], [800, 500]])
            .extent([[d3.min(this.xScale.range()), d3.min(this.yScale.range())], 
             [d3.max(this.xScale.range()), d3.max(this.yScale.range())]])
             // .on('start brush', this.brushedSelction )
              .on("brush end", (event)=>{
                  let bdots = d3.select('#graph1').selectAll('circle')
                  if(event.selection === null) {
                    globalApplicationState.list.updatetable(this.x)
                    bdots.attr('opacity', 1)
                    this.updatecards(filteredData)
                  }
                   const [[x0,y0], [x1,y1]] = event.selection;
                   //console.log(event.selection)
                   bdots.attr('opacity', '.3')
                   bdots.filter(d =>{
                    return x0< this.xScale(d.Year) 
                    && x1 >this.xScale(d.Year)
                    && y0 < this.yScale(d[yval])
                    && y1 > this.yScale(d[yval]) 
                   
                }).attr('opacity', 1)
                let brushedData = filteredData.filter(d =>{
                    return x0< this.xScale(d.Year) 
                    && x1 >this.xScale(d.Year)
                    && y0 < this.yScale(d[yval])
                    && y1 > this.yScale(d[yval]) 
            
                })
                //console.log(brushedData)
                this.updatecards(brushedData)
                globalApplicationState.list.updatetable(brushedData)
              })
            const brushsvg =  this.mainGraph.append('g').attr('class', 'brush').call(brush)
              
          this.mainGraph.append('g').selectAll('dot')
          .data(filteredData)
          .enter()
          .append('circle')
              .attr('cx', (d)=> this.xScale(d.Year))
              .attr('cy',  (d)=> this.yScale(d[yval]))
              .attr('r',3)
              .style("fill", d=> this.colorScale(d))
              .on('mouseover', function(d,i){
                  d3.select(this).attr('r', 5)
                Tooltip.style('visibility', 'visible').style('position', 'absolute').html("Title: " + i.Title + "</br> Score: " + i.RTScore + "</br> Year: " + i.Year)
            })
            .on("mousemove", function(d){
                Tooltip.style('top', d.pageY -10 + "px").style("left", d.pageX + 10 + "px");
            })
            .on('mouseout', function(d){
                Tooltip.style("visibility", "hidden"); 
                d3.select(this).attr('r', 3)
            })
            
     } 

}