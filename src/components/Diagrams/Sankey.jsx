import {
    format as d3Format,
    event,
    scaleOrdinal,
    schemeCategory10,
    select
} from 'd3'
import {
    sankey as d3Sankey,
    sankeyLinkHorizontal
} from 'd3-sankey'

const guid = () => {
    const _p8 = (i) => {
        const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
        return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
    }
    return _p8() + _p8(true) + _p8(true) + _p8()
}

const chart = ({
    container,
    data,
    size: { width, height },
    nodeWidth = 50,
    nodePadding = 40,
    getPopupContent = () => {},
    onNodeClick
}) => {
    select(container).select('svg').remove()
    const svg = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('width', '100%')
        .style('height', 'auto')

    const { nodes, links } = d3Sankey()
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([[1, 1], [width - 1, height - 25]])({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        })

    const scale = scaleOrdinal(schemeCategory10)
    const color = name => scale(name.replace(/ .*/, ''))
    const format = d => `$${d3Format(',.0f')(d)}`

    const infoPopup = select('#d3Tooltip')

    svg.append('g')
        .attr('stroke', '#000')
        .selectAll('rect')
        .data(nodes.filter(d => !d.photo))
        .enter()
        .append('circle')
        .attr('cx', d => (d.x0 < width / 2 ? d.x1 - 21 : d.x0 + 21))
        .attr('cy', d => (d.y0 + d.y1) / 2)
        .attr('r', 20)
        .attr('fill', d => color(d.name))
        .on('click', onNodeClick)
        .style('cursor', 'pointer')

    svg.append('g')
        .attr('stroke', '#000')
        .selectAll('rect')
        .data(nodes.filter(d => d.photo))
        .enter()
        .append('image')
        .attr('xlink:href', d => d.photo)
        .attr('x', d => (d.x0 < width / 2 ? d.x1 - 41 : d.x0 + 41))
        .attr('y', d => ((d.y0 + d.y1) / 2) - 20)
        .attr('width', 40)
        .attr('height', 40)
        .on('click', onNodeClick)
        .style('cursor', 'pointer')
        .on('mouseover', (d) => {
            infoPopup
                .transition()
                .duration(200)
                .style('opacity', 0.9)
            infoPopup
                .html(getPopupContent(d))
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', () => {
            infoPopup
                .transition()
                .duration(500)
                .style('opacity', 0)
        })

    const link = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.5)
        .selectAll('g')
        .data(links)
        .enter()
        .append('g')
        .style('mix-blend-mode', 'multiply')

    const gradient = link.append('linearGradient')
        .attr('id', (d) => {
            d.uid = guid()
            return d.uid
        })
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', d => d.source.x1)
        .attr('x2', d => d.target.x0)

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d => color(d.source.name))

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d => color(d.target.name))

    link.append('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', d => `url(#${d.uid})`)
        .attr('stroke-width', d => Math.max(1, d.width))

    svg.append('g')
        .style('font', '10px sans-serif')
        .selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
        .text(d => `${d.name} (${format(d.value)})`)

    return svg.node()
}

export default chart
