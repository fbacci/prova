function drawChart(data) {
    $('#rowVer').addClass('hidden');
    $('#barchartV').addClass('hidden');
    $('#barchart').removeClass('hidden');

    var w = $('#barchartDiv').width(), h = $('#barchartDiv').height();
    var wX = $('#asseX').width(), hX = $('#asseX').height();

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 700;
    var height = getHeight(data) + margin.bottom;

    var y = d3.scalePoint()
        .domain(data.map(function (d) {
            return d.item_user_id;
        }))
        .range([getHeight(data), 0]).padding(0.55);

    var x = d3.scaleLinear()
        .range([2, width])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var xAxis = d3.scaleLinear()
        .range([2, width + 200])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    if (!($('#inputQuestion').val().includes('login'))) {
        $('#barchart').css('height', '400px');
    } else {
        $('#barchart').css('height', '200px');
    }

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("id", "svgBar")
        .attr('viewBox', function () {
            if (!($('#inputQuestion').val().includes('login'))) {
                if (!($('#inputQuestion').val().includes('raggruppati'))) {
                    return '0 0 ' + (w - 298) + ' ' + height;
                } else {
                    return '0 0 ' + (w + 100) + ' ' + height;
                }
            } else {
                return '0 0 ' + (w * 1.2) + ' ' + height;
            }
        })
        .append("g")
        .attr("transform",
            function () {
                if ($('#inputQuestion').val().includes('raggruppati')) {
                    return "translate(" + margin.left * 1.3 + ', ' + margin.top + ")";
                } else {
                    return "translate(" + margin.left * 2 + ', ' + margin.top + ")"
                }
            });

    populateBar(data, svg, x, y, height);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return -95;
            } else {
                return -65;
            }
        })
        .attr("x", -80)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "20px";
            } else {
                return "13px";
            }
        })
        .text("Nome atleta");

    d3.select("#asseX").append('svg')
        .attr('id', 'xAxis')
        .attr("viewBox", function () {
            if (!($('#inputQuestion').val().includes('login'))) {
                if (!($('#inputQuestion').val().includes('raggruppati'))) {
                    return (-margin.left * 2.55) + ' 0 ' + wX + ' ' + hX;
                } else {
                    return (-margin.left - 52) + ' 0 ' + wX * 1.5 + ' ' + hX;
                }
            } else {
                return (-margin.left - 51) + ' -2 ' + (wX * 1.5 + 55) + ' ' + hX;
            }
        })
        .append("g")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "18px";
            } else {
                return "10px";
            }
        })
        .call(d3.axisBottom(xAxis).ticks(6));

    d3.select('#asseX').select('svg')
        .append("text")
        .attr("y", 35)
        .attr("x", function () {
            if($('#piechartDiv').hasClass('hidden')){
                return $('#asseX').width() - 450;
            } else {
                return $('#asseX').width() + 100;
            }
        })
        .style("text-anchor", "middle")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "20px";
            } else {
                return "15px";
            }
        })
        .text(setXAxisText());

    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function populateBar(list, svgVar, newx, newy) {
    svgVar.selectAll(".bar")
        .data(list)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function (d) {
            return newx(d.orderField);
        })
        .attr("height", 15)
        .attr("y", function (d) {
            return newy(d.item_user_id) - 7.5;
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + "<br/>" + d.orderField)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("class", "bar");
        });

    svgVar.append("g")
        .style("font-size", function () {
            if ($('#inputQuestion').val().includes('raggruppati')) {
                return "15px";
            } else {
                return "10px";
            }
        })
        .call(d3.axisLeft(newy));
}

function drawVerChart(data) {
    $('#barchartV').removeClass('hidden');
    $('#rowVer').removeClass('hidden');
    $('#barchart').addClass('hidden');
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = getWidth(data);
    var height = 320;

    var w = $('#rowVer').width(), h = $('#rowVer').height();

    var x = d3.scalePoint()
        .range([getWidth(data), 0])
        .domain(data.map(function (d) {
            return d.item_user_id;
        })).padding(0.35);

    var y = d3.scaleLinear()
        .range([height - 50, 0])
        .domain([0, d3.max(data, function (d) {
            return d.orderField;
        })]);

    var svg = d3.select("#barchartV").append("svg")
        .attr("id", "svgBarVer")
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr("transform",
            "translate(0," + margin.top + ")");

    populateVerBar(data, svg, x, y, height);

    svg.append("g").attr('transform', 'translate(0,' + (height - 50) + ')')
        .call(d3.axisBottom(x)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    d3.select("#yAxis")
        .attr("height", height)
        .attr("width", 55)
        .append("g")
        .attr("transform", "translate(50, 20)")
        .call(d3.axisLeft(y));

    var toolt = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function populateVerBar(list, svgVar, newx, newy, height) {
    svgVar.selectAll(".bar")
        .data(list)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 15)
        .attr("height", function (d) {
            return height - newy(d.orderField) - 50;
        })
        .attr("x", function (d) {
            return newx(d.item_user_id) - 7.5;
        })
        .attr("y", function (d) {
            return newy(d.orderField);
        })
        .on("mouseover", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.selectAll('.tooltip').html(d.item_user_id + "<br/>" + d.orderField)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip').transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("class", "bar");
        });
}

$(document).ready(function () {
    var currentSort = $('#dropdownMenu1').text();
    var currentMode = $('#dropdownMenu4').text();
    var currentOrient = $('#dropdownMenu3').text();

    var sliderRange = d3.sliderBottom()
        .min(1)
        .max(5)
        .step(1)
        .width(250)
        .ticks(5)
        .default([1, 5])
        .fill('dodgerblue')
        .on('onchange', val => {
            var currentSort = $('#dropdownMenu1').text();
            var currentMode = $('#dropdownMenu4').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    orderMode: currentSort.toLowerCase(),
                    criterio: currentMode
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#yAxis").select("g").remove();
                    data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1]);
                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                    manageErrors();
                    setFeedbackColor();

                    console.log($('#barchart'));

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log("errore 4");
                }
            })
        });

    var gRange = d3
        .select('div#slider-range')
        .append('svg')
        .attr('width', 300)
        .attr('height', 80)
        .append('g')
        .attr('transform', 'translate(20,30)');

    gRange.call(sliderRange);

    $('#ordinamento').on("click", function () {
        var currentMode = $('#dropdownMenu4').text();

        if (currentSort !== $('#dropdownMenu1').text()) {
            currentSort = $('#dropdownMenu1').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select('#yAxis').select("g").remove();

                    if (currentMode == 'voto')
                        if (sliderRange.value()[0] != 1 || sliderRange.value()[1] != 1) {
                            data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                        }

                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                    manageErrors();
                    setFeedbackColor();

                    manageDropdown();

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }

                },
                error: function () {
                    console.log("errore");
                }
            })
        }
    });

    $('#orientamento').on("click", function () {
        if (currentOrient !== $('#dropdownMenu3').text()) {
            currentOrient = $('#dropdownMenu3').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select('#barchart').select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select('#yAxis').select("g").remove();

                    if (currentMode == 'voto') {
                        if ($('#inputQuestion').val().includes('ordina') &&
                            (sliderRange.value()[0] != 1 || sliderRange.value()[1] != 1)) {
                            data = getNewList(data, sliderRange.value()[0], sliderRange.value()[1])
                        }
                    }

                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));

                    manageErrors();
                    setFeedbackColor();

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log("errore hor");
                }
            })
        }
    });

    $('#criterio').on("click", function () {
        if (currentMode !== $('#dropdownMenu4').text()) {
            currentMode = $('#dropdownMenu4').text();
            $.ajax({
                url: '',
                type: 'POST',
                data: {
                    question: $('#inputQuestion').val(),
                    criterio: currentMode,
                    orderMode: currentSort.toLowerCase()
                },
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select('#yAxis').select("g").remove();

                    if (currentMode !== 'voto' || $('#inputQuestion').val().includes('migliori')) {
                        $('#sliderVoto').addClass('hidden');
                    } else {
                        $('#sliderVoto').removeClass('hidden');
                    }

                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));

                    manageErrors();
                    setFeedbackColor();

                    manageDropdown();

                    if ($('#inputQuestion').val().includes('login')) {
                        data = data.slice(0, data.length - 1);
                    }

                    if (currentOrient.includes('Orizzontale')) {
                        drawChart(data);
                    } else {
                        drawVerChart(data);
                    }
                },
                error: function () {
                    console.log('errore 3')
                }
            })
        }
    });
});

function setXAxisText() {
    var value = $('#inputQuestion').val();

    if (value.includes('ordina') || value.includes('migliori')) {
        var currentMode = $('#dropdownMenu4').text();

        if (currentMode === 'calorie') {
            return 'Calorie';
        } else if (currentMode === 'velocità media') {
            return 'Velocità media';
        } else {
            return 'Voto';
        }
    } else if (value.includes('atleti con')){
        if(value.includes('atleti con bpm')){
            return "bpm";
        } else if(value.includes('atleti con età')){
            return "Età"
        }
    }
}