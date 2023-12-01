class Cards {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
        this.showData = globalApplicationState.showData;
        this.tooltip = null;


        let margin = { top: 30, right: 30, bottom: 30, left: 30 },
            width = 800 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        this.tooltip = d3.select('#cards').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    

        this.cards = d3.select('#cards')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        this.createDonutCharts();
    }

    createDonutCharts() {
        const radius = 75;
    
        const streamingPlatforms = ['Netflix', 'Hulu', 'Prime', 'Disney'];
    
        let color;
        
        const donutCharts = this.cards.selectAll('.donut-chart')
            .data(streamingPlatforms)
            .enter()
            .append('g')
            .attr('class', 'donut-chart')
            .attr('transform', (d, i) => `translate(${i * 180 + 100}, 150)`);
    
        donutCharts.each((platform, i, nodes) => {
           
            const platformData = this.showData.filter((show) => show[platform.toString()] === '1');
            console.log(platformData);
            const tvShowCount = platformData.filter((show) => show.Type === '1').length;
            const movieCount = platformData.filter((show) => show.Type === '0').length;
            const total = tvShowCount + movieCount;
    
            if (platform === 'Netflix') {
                color = d3.scaleOrdinal(['#db0000', '#ff7373']);
            } else if (platform === 'Hulu') {
                color = d3.scaleOrdinal(['#3dbb3d', '#86db86']);
            } else if (platform === 'Prime') {
                color = d3.scaleOrdinal(['#00a8e1', '#77c0d9']);
            } else if (platform === 'Disney') {
                color = d3.scaleOrdinal(['#393e8f', '#5961e3']);
            }
    
            const pie = d3.pie().value((d) => d).sort(null);
            const data = [tvShowCount / total * 100, movieCount / total * 100];

            

            
    
            const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    
           

            d3.select(nodes[i])
                .selectAll('path')
                .data(pie(data))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .on('mouseover', (event, d) => {
                    const currentArc = d3.select(nodes[i]);
                    const isTV = d.data === data[0];
                    const count = isTV ? tvShowCount : movieCount;
                    const percentage = isTV ? (tvShowCount / total) * 100 : (movieCount / total) * 100;
                    currentArc.selectAll(isTV ? 'path:nth-child(1)' : 'path:nth-child(2)')
                        .transition()
                        .duration(200)
                        .attr('d', d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 1.1));
                    this.tooltip.transition()
                        .duration(100)
                        .style('opacity', .9);
                    this.tooltip.html(`${platform}<br>Total Count: ${total}<br>${isTV ? 'TV Show' : 'Movie'}: Count ${count}<br> Percentage ${percentage.toFixed(2)}%`)
                        .style('left', (event.pageX) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function (event, d) {
                    // Restore the arc size or color on mouseout
                    d3.select(this)
                        .transition()
                        .attr('d', arc);
                
                    // Hide the tooltip
                    this.tooltip.transition()
                        .duration(10)
                        .style('opacity', 0);
                });
    
            d3.select(nodes[i])
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', 4)
                .text(`${platform}`)
                .style('font-size', '12px');
        });
    }
}    