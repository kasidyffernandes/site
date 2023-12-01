async function loadData(){
  const showData = await d3.csv('data/shows.csv');
  console.log(showData)
  const RevenueData = await d3.csv('data/Revenue.csv');
  const testData = await d3.csv('data/test.csv');
  //console.log(showData, RevenueData, testData)
  return{showData, RevenueData, testData};
}

const globalApplicationState={
  showData:null,
  RevenueData: null,
  testData:null,
  mainGraph: null,
  lineChart: null,
  cards: null,
  list: null,
  bdata: null
};

loadData().then((loadedData)=>{

  globalApplicationState.showData = loadedData.showData;
  globalApplicationState.RevenueData = loadedData.RevenueData;
  globalApplicationState.testData = loadedData.testData;
  globalApplicationState.bdata = loadedData.bdata;

  const mainGraph = new MainGraph(globalApplicationState);
  const lineChart = new LineChart(globalApplicationState);
  const barChart = new BarChart(globalApplicationState);
  const cards = new Cards(globalApplicationState);
  const list = new List(globalApplicationState);
  
  globalApplicationState.mainGraph = mainGraph;
  globalApplicationState.lineChart = lineChart;
  globalApplicationState.barChart = barChart;
  globalApplicationState.cards = cards;
  globalApplicationState.list = list;

  d3.selectAll('#plat').on('change', function(){
    let v = this.value
    if(this.checked == false){
      console.log(v)
      d3.select('#graph1').selectAll('circle').filter(function(d){
        return +d[v] == 1
      }).style('opacity', '0')
      d3.selectAll("."+ v).style('opacity', '0')
    }
    else{
      d3.select('#graph1').selectAll('circle').filter(function(d){
        return +d[v] == 1
      }).style('opacity', '1')
      d3.selectAll("." +v).style('opacity', '1')
    }

  })

  d3.selectAll('#filter').on('change', function(){
    var aa = document.querySelectorAll('input[type=checkbox]');
      for (var i = 0; i < aa.length; i++){
        aa[i].checked = true
      
    }
    var type = document.querySelector('input[name="type"]:checked').value;
    var age = document.querySelector('.age').value;
    var typedata, filteredData
    if(type ==0 ){
        typedata = globalApplicationState.showData.filter(function(d){return d.Type == '0'})
    }else{
        typedata = globalApplicationState.showData.filter(function(d){return d.Type == '1'})
    }
    if(age == 'Allvalues'){
        filteredData= typedata
    }else{
        filteredData = typedata.filter(function(d){return d.Age == age})
    }
    //value = d3.select(this).property('value')
    //type = d3.select(this).property('name')
    console.log(filteredData)
    d3.select('#graph1').selectAll('circle').remove()
    mainGraph.updateTable(filteredData)
    list.updatetable(filteredData)
 })
});