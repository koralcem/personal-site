const chartState = {
  numbers: [2, 3, 5, 5, 7, 9, 2, 3, 5, 5, 7, 9, 2, 3, 5, 5, 7, 9],
  domain: [0, 10],
  correctRange: [5, 8],
  showCorrectRange: false,
  numberOfBins: 10,
  dimensions: {
    width: 600,
    height: 400
  },
  margins: {
    top: 20,
    right: 10,
    bottom: 30,
    left: 30
  }
}

chartState.innerDimensions = {
  width: chartState.dimensions.width - chartState.margins.right - chartState.margins.left,
  height: chartState.dimensions.height - chartState.margins.top - chartState.margins.bottom
}

function init (state) {
  initChart(state)
  initControls(state)
}

function initChart (state) {
  d3.select('#histogram')
    .append('svg')
    .attr('width', state.dimensions.width)
    .attr('height', state.dimensions.height)

  d3.select('svg')
    .append('g')
    .classed('x-axis', true)

  d3.select('svg')
    .append('g')
    .classed('y-axis', true)

  d3.select('svg')
    .append('g')
    .classed('chart', true)
    .attr('transform', `translate(${state.margins.left}, ${state.margins.top})`)

  // append a group to house the bars of the chart
  d3.select('.chart')
    .append('g')
    .classed('bars', true)

  // append a group for the mean line
  const meanGroup = d3.select('.chart')
    .append('g')
    .classed('mean', true)

  meanGroup.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', state.innerDimensions.height)
  meanGroup.append('text')
  meanGroup.attr('stroke', 'red')
}

function initControls (state) {
  d3.select('#add-single-response').on('click', () => {
    const inputField = d3.select('#response-entry')
    const responseToAdd = +inputField.property('value')
    // TODO: add validation ?
    state.numbers.push(responseToAdd)
    inputField.property('value', '') // clear the input field
    renderState(state)
  })

  d3.select('#add-multiple-responses').on('click', () => {
    const numResponsesToAdd = 10
    for (let i = 0; i < numResponsesToAdd; i++) {
      const responseToAdd = getRandomInInterval(state.domain[0], state.domain[1])
      state.numbers.push(responseToAdd)
    }
    renderState(state)
  })

  d3.select('#remove-multiple-responses').on('click', () => {
    const numResponsesToRemove = 10
    state.numbers.splice(0, state.numbers.length >= numResponsesToRemove ? numResponsesToRemove : state.numbers.length)
    renderState(state)
  })

  d3.select('#show-correctness').on('change', function () {
    state.showCorrectRange = this.checked
    renderState(state)
  })

  d3.select('#domain-min').on('change', function () {
    state.domain[0] = this.value
    renderState(state)
  })

  d3.select('#domain-max').on('change', function () {
    state.domain[1] = this.value
    renderState(state)
  })

  d3.select('#number-of-bins').on('change', function () {
    state.numberOfBins = this.value
    renderState(state)
  })

  d3.select('#correct-range-min').on('change', function () {
    state.correctRange[0] = this.value
    renderState(state)
  })

  d3.select('#correct-range-max').on('change', function () {
    state.correctRange[1] = this.value
    renderState(state)
  })
}

function renderState (state) {
  renderChart(state)
  renderControls(state)
}

function renderChart (state) {
  // X axis
  const x = d3.scaleLinear()
  .domain(state.domain)
  .range([0, state.innerDimensions.width])

  d3.select('.x-axis')
    .transition().duration(500)
    .call(d3.axisBottom(x))
    .attr('transform', `translate(${state.margins.left}, ${state.dimensions.height - state.margins.bottom})`)

  const histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(state.numberOfBins))

  let bins = histogram(state.numbers)

  // Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, bin => bin.length)])
    .range([state.innerDimensions.height, 0])

  d3.select('.y-axis')
    .transition().duration(500)
    .call(d3.axisLeft(y))
    .attr('transform', `translate(${state.margins.left}, ${state.margins.top})`)

  const isBinCorrect = (bin) => state.correctRange[0] <= bin.x0 && bin.x1 <= state.correctRange[1]

    // Render the bars
  const dataJoin = d3.select('.bars')
    .attr('show-correct', () => state.showCorrectRange)
    .selectAll('rect')
    .data(bins, bin => bin.x0)

  dataJoin.enter()
    .append('rect')
    .merge(dataJoin)
      .classed('correct', isBinCorrect)
      .transition().duration(500)
      .attr('width', bin => x(bin.x1) - x(bin.x0))
      .attr('x', bin => x(bin.x0))
      .attr('height', bin => state.innerDimensions.height - y(bin.length))
      .attr('y', bin => y(bin.length))

  dataJoin.exit().remove()

  // Render the mean line
  const mean = d3.mean(state.numbers)

  const meanGroup = d3.select('.mean')
  meanGroup.select('text').text(`Mean: ${mean}`)
  meanGroup.transition().duration(500)
    .attr('transform', `translate(${x(mean)}, 0)`)
}

function renderControls (state) {
  // Render a button for each entry in state.numbers
  const dataJoin = d3.select('#remove-single-response').selectAll('button').data(state.numbers, d => d)

  dataJoin.enter()
    .append('button')
    .text(d => d)
    .on('click', (event, d) => {
      state.numbers.splice(state.numbers.indexOf(d), 1)
      renderState(state)
    })

  dataJoin.exit().remove()

  d3.select('#domain-min').property('value', state.domain[0])
  d3.select('#domain-max').property('value', state.domain[1])
  d3.select('#number-of-bins').property('value', state.numberOfBins)
  d3.select('#correct-range-min').property('value', state.correctRange[0])
  d3.select('#correct-range-max').property('value', state.correctRange[1])
  d3.select('#show-correctness').property('checked', state.showCorrectRange)
}

function getRandomInInterval (min, max) {
  return Math.random() * (max - min) + min;
}

init(chartState)
renderState(chartState)


/*
TODO:
- Format all numbers to 2 significant digits
- Better handling of the y axis scaling. It doesn't have to scale up and down with *every* response
- Mean: make it a bubble? What does that mean exactly?
=== Ask for feedback here
- Validation of all inputs
- Do we want to expose number of bins to user?
- Better styling of everything: controls on bottom, widths of input fields, axis labels, etc.
*/
