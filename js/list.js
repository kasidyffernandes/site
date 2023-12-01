const cell= 20;
const dict = {
  Title:350,
  Year: 70,
  RTScore: 60,
  Age:50,
  IMDb:50,
}
class List{
    constructor(globalApplicationState){
        this.globalApplicationState = globalApplicationState

        this.showData = globalApplicationState.showData
        this.revenuData = globalApplicationState.revenuData
       // console.log(this.showData)

        var x = this.showData.filter(function(d){return d.Type == '0'})

        let margin = {top:30, right:30, bottom:30, left:30},
            width = 200 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        
        this.list = d3.select('#list').append('svg')
            .attr('width', width+margin.left+margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', "translate("+margin.left+","+margin.top+")");
        
    this.header = [
        {name: 'Title', key: 'Title'},
        {name: 'Year', key: 'Year'},
        {name: 'Age', key: 'Age'},
        {name: 'RTScore', key: 'RTScore'},
        {name: 'IMDb', key: 'IMDb'},
      ]

        this.table = d3.select("#table")
        this.tablebody = d3.select("#tablebody")

        let top = x.sort((a,b)=>{
          return d3.descending(a.RTScore, b.RTScore);})
          .slice(0,100)
        this.createheader();

      //  console.log(top)
        this.updatetable(top)
    }
    createheader(){
        const th = this.table.append('thead')
          .append('tr')
          .selectAll('th')
          .data(this.header)
          .join('th')
          .append('svg')
          .attr('height', cell)
          .attr('width', (d) => dict[d.key])
       
    
        th.selectAll("rect")
          .data((d) => [d])
          .join("rect")
          .attr('class', 'header')
          .attr("width", (d) => dict[d.key])
          .attr("height", cell)
          .attr('x', 0)
          .attr('y', 0);
        
        th.selectAll("text")
          .data((d) => [d])
          .join("text")
      .attr('class', 'header-text')
      .text(function(d){
         // console.log('d', d.name)
          return d.name
      })
      .style("text-anchor", "middle")
      .style("font-weight", "700")
      .attr("transform", (d) => {
        return `translate(${dict[d.key] / 2}, 5)`;
      });
    }
    updatetable(data){
        let x =data.sort((a,b)=>{return d3.descending(a.RTScore, b.RTScore);}).slice(0,200)
        
        const y = x.map((d)=>{
            return {
                Title: d.Title,
                Year: d.Year,
                Age: d.Age,
                RTScore: d.RTScore,
                IMDb: d.IMDb,
            }
        })

        const tableRows = this.tablebody
        .selectAll('tr')
        .data(y)
        .join('tr')
        tableRows.selectAll('td')
        .data((d)=>d3Entries(d)).join('td')
        .text(function(d){
          //  console.log('a ' ,d)
            return d.value
        }).attr("width", (d) => dict[d.key])

    }


}function d3Entries(obj){
    return Object.entries(obj).map((entry)=>({
        key: entry[0],
        value: entry[1],
    }));
}