$(document).ready(function () {
    var queries = ["ordina gli atleti per voto", "ordina gli atleti per velocità media", "ordina gli atleti per calorie",
        "mostra i migliori atleti", "raggruppati per calorie", "raggruppati per calorie giornaliere",
        "raggruppati per età", "mostra andamento login di questa settimana", "mostra andamento login di questo mese",
        "mostra andamento login di quest'anno"];
    //var fakerator = new Fakerator();

    manageDropdown();

    /*** GESTIONE INPUT ***/
    $('#clearBtn').on('click', function () {
        $('#inputQuestion').val('');
        $('#inputQuestion').tagsinput('removeAll');

        reset();

        $('#numres').text('');
        $('a#dropdownMenu3').text('Orizzontale');
        $('a#dropdownMenu1').text('Decrescente');
    });

    $('#inputQuestion').on('itemRemoved', function (event) {
        reset();

        var v = setValue($('#inputQuestion').val());

        manageErrors();
        setFeedbackColor();
        manageDropdown();

        if (v == '') {
            $('#numres').addClass('hidden');
            $('#numres').text('');
            $('#info').addClass('hidden');
            $('a#dropdownMenu3').text('Orizzontale');
            $('a#dropdownMenu1').text('Decrescente');
        } else {
            $.ajax({
                url: '',
                type: 'POST',
                data: {question: $('#inputQuestion').val(), criterio: $('#dropdownMenu4').text()},
                success: function (data) {
                    data = JSON.parse(data);
                    d3.select("#barchart").select("#svgBar").remove();
                    d3.select("#barchartV").select("#svgBarVer").remove();
                    d3.select("#linechart").select("#svgbar").remove();
                    d3.select("#piechart").select("#svgPie").remove();
                    d3.select("#asseX").select("#xAxis").remove();
                    d3.select("#yAxis").select("g").remove();
                    d3.select("#scatter").select("#svgScat").remove();
                    $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                    manageErrors();
                    setFeedbackColor();
                    drawCharts($('#inputQuestion').val(), data);
                },
                error: function () {
                    console.log('errore cancellazione')
                }
            })
        }

    });

    $('#inputQuestion').tagsinput({
        typeahead: {
            source: queries,
            afterSelect: function () {
                this.$element[0].value = '';
            }
        }
    });

    setValue($('#inputQuestion').val());

    $(function () {
        $.ajax({
            url: 'infodataset',
            type: 'POST',
            data: {dataset: 'Workout'},
            success: function (data) {
                data = JSON.parse(data);
                setDatasetInfo(data);
            },
            error: function () {
                console.log('errore 7')
            }
        });
    });

    /*** GESTIONE PICKER DATE***/
    $(function () {
        $('#datetimepicker7').datetimepicker({
            format: 'DD/MM/YYYY'
        });
        $('#datetimepicker8').datetimepicker({
            format: 'DD/MM/YYYY',
            useCurrent: false
        });
        $("#datetimepicker7").on("change.datetimepicker", function (e) {
            $('#datetimepicker8').datetimepicker('minDate', e.date);
        });
        $("#datetimepicker8").on("change.datetimepicker", function (e) {
            $('#datetimepicker7').datetimepicker('maxDate', e.date);
        });
    });

    $('#qForm').keyup(function (e) {
        manageForm(e);
    });

});

/*** FUNZIONE GRAFICI ***/
function drawCharts(value, data) {
    var currentOrient = $('#dropdownMenu3').text();

    $('#rowBar').addClass('hidden');
    $('#piechartDiv').addClass('hidden');
    $('#rowLine').addClass('hidden');
    $('#rowScatter').addClass('hidden');

    $('#rowVer').addClass('hidden');

    $('#colOrdinamento').addClass('hidden');
    $('#dropCriterio').addClass('hidden');
    $('#sliderVoto').addClass('hidden');

    $('#chooseDate').addClass('hidden');

    $('#numres').addClass('hidden');

    var n = 0, d;

    if (!(Array.isArray(data[0])) && Array.isArray(data[data.length - 1])) {
        for (d in data) {
            n += d[1];
        }
    }

    if (data.length != 0) {
        setValue(value);

        if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori')) && value.includes('raggruppati per')) {
            if (n != 0) {
                $('#rowBar').removeClass('hidden');

                $('#rowBar').removeClass('h-100');
                $('#rowBar').addClass('h-55');


                if (value.includes('atleti con')) {
                    $('#barchartText').text('Lista atleti');
                } else {
                    $('#dropCriterio').removeClass('hidden');
                    $('#barchartText').text('Migliori atleti per: ');
                }

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data.slice(0, data.length - 1));
                else {
                    drawVerChart(data.slice(0, data.length - 1));
                }

                $('#piechartDiv').removeClass('hidden');
                var perc = getPercList(data.slice(0, data.length - 1), value);
                drawPieChart(perc);

                $('#rowLine').removeClass('hidden');
                $('#rowLine').removeClass('h-100');
                $('#rowLine').addClass('h-40');
                drawLineChart(data[data.length - 1]);

                $('#dropOrientamento').addClass('hidden');
                $('#colOrdinamento').removeClass('hidden');
            } else {
                $('#numres').text('Nessun risultato.');
            }
        } else if (value.includes('login') && (value.includes('atleti con') || value.includes('migliori'))) {
            if (n != 0) {
                $('#rowBar').removeClass('hidden');

                $('#linechartDiv').addClass('mymargintop');

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data.slice(0, data.length - 1));
                else drawVerChart(data.slice(0, data.length - 1));

                $('#linechartDiv').removeClass('hidden');
                drawLineChart(data[data.length - 1]);
            } else {
                $('#numres').text('NESSUN RISULTATO!');
            }
        } else {
            if (value.includes('login')) {
                $('#linechartDiv').removeClass('mymargintop');
                $('#rowLine').removeClass('hidden');
                $('#chooseDate').removeClass('hidden');
                drawLineChart(data);
            }

            if (value.includes('ordina')) {
                $('#barchartText').text('Criterio: ');
                $('#rowBar').removeClass('hidden');
                $('#colOrdinamento').removeClass('hidden');

                $('#dropCriterio').removeClass('hidden');

                if (!value.includes('voto')) {
                    $('#sliderVoto').addClass('hidden');
                } else {
                    $('#sliderVoto').removeClass('hidden');
                }

                if (currentOrient.includes('Orizzontale'))
                    drawChart(data);
                else drawVerChart(data);
            }

            if (value.includes('migliori') || value.includes('atleti con')) {
                $('#rowBar').removeClass('hidden');
                $('#dropOrientamento').removeClass('hidden');

                if (value.includes('migliori')) {
                    $('#dropCriterio').removeClass('hidden');
                    $('#barchartText').text('Migliori atleti per: ');
                } else {
                    $('#dropCriterio').addClass('hidden');
                    $('#colOrdinamento').removeClass('hidden');
                    $('#barchartText').text('Lista atleti ');
                }

                if (value.includes('raggruppati per')) {
                    $('#piechartDiv').removeClass('hidden');

                    if (currentOrient.includes('Orizzontale'))
                        drawChart(data);
                    else drawVerChart(data);

                    var perc = getPercList(data, value);
                    drawPieChart(perc)
                } else {
                    if (currentOrient.includes('Orizzontale'))
                        drawChart(data);
                    else drawVerChart(data);
                }


            }

            if (value.includes('distribuzione')) {
                $('#rowScatter').removeClass('hidden');
                drawScatterPlot(data);
            }
        }
    } else {
        $('#numres').text('NESSUN RISULTATO!');
    }

    $('#info').removeClass('hidden');
    $('#numres').removeClass('hidden');

    manageErrors();
    setFeedbackColor();
}

/*** FUNZIONE SET VALORI DROPDOWN ETC ***/
function setValue(value) {
    if (value === '') {
        $('a#dropdownMenu4').text('');
        $('a#dropdownMenu5').text('');
    }

    if (value.includes('ordina')) {
        if (value.includes('calorie')) {
            $('a#dropdownMenu4').text('calorie');
        } else if (value.includes('velocità')) {
            $('a#dropdownMenu4').text('velocità media');
        } else {
            $('a#dropdownMenu4').text('voto');
        }
    } else if (value.includes('migliori')) {
        var currentMode = $('#dropdownMenu4').text();

        if (currentMode === 'calorie') {
            $('a#dropdownMenu4').text('calorie');
        } else if (currentMode === 'velocità media') {
            $('a#dropdownMenu4').text('velocità media');
        } else {
            $('a#dropdownMenu4').text('voto');
        }
    }

    if (value.includes('settimana')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('settimana');
        $('#dropData').removeClass('hidden');
    } else if (value.includes('mese')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('mese');
        $('#dropData').removeClass('hidden');
    } else if (value.includes('anno')) {
        $('#rangeLineChart').text("Intervallo: ");
        $('a#dropdownMenu5').text('anno');
        $('#dropData').removeClass('hidden');
    } else {
        $('#rangeLineChart').text("Login intervallo date");
        $('#dropData').addClass('hidden');
    }

    $('a#dropdownMenu3').text('Orizzontale');
    $('a#dropdownMenu1').text('Decrescente');
}

/*** FUNZIONE ERRORI ***/
function manageErrors() {
    if ($('#inputQuestion').val().includes('ordina') && $('#inputQuestion').val().includes('raggruppati')) {
        $('#barchartDiv').addClass('hidden');
        $('#piechartDiv').addClass('hidden');
        $('#info').addClass('hidden');
        $('#numres').text('ERRORE!');
    }
}

/*** FUNZIONE SET COLOR ERRORI/RISULTATI ***/
function setFeedbackColor() {
    if ($('#numres').text().includes('ERRORE') || $('#numres').text().includes('Nessun risultato')) {
        $('#numres').css('color', 'red');
    } else {
        $('#numres').css('color', 'forestgreen');
    }
}

/*** FUNZIONE INFO DATASET ***/
function setDatasetInfo(data) {
    var i, minE = 100, maxE = 0, minS = 1000.0, maxS = 0.0, minB = 300, maxB = 0, minC = 3500, maxC = 0, maxM = 0,
        minM = 5;
    var txtP = $('#persone').text(), txtE = $('#eta').text(), txtS = $('#velocita').text(), txtB = $('#bpm').text(),
        txtC = $('#calorie').text(), txtM = $('#voto').text();

    for (i = 0; i < data.length; i++) {
        $('#persone').text(txtP.concat(data[i].item_user_id).concat(", "));
        txtP = $('#persone').text();

        if (i > 5) {
            $('#persone').text(txtP.concat("... "));
            i = data.length;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgM > maxM) {
            maxM = data[i].avgM;
        }

        if (data[i].avgM < minM) {
            minM = data[i].avgM;
        }
    }


    for (i = 0; i < data.length; i++) {
        if (data[i].age > maxE) {
            maxE = data[i].age;
        }

        if (data[i].age < minE) {
            minE = data[i].age;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgS > maxS) {
            maxS = data[i].avgS;
        }

        if (data[i].avgS < minS) {
            minS = data[i].avgS;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgB > maxB) {
            maxB = data[i].avgB;
        }

        if (data[i].avgB < minB) {
            minB = data[i].avgB;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i].avgC > maxC) {
            maxC = data[i].avgC;
        }

        if (data[i].avgC < minC) {
            minC = data[i].avgC;
        }
    }

    $('#eta').text(txtE.concat(minE.toString().concat(" - ").concat(maxE.toString())));
    $('#bpm').text(txtB.concat(minB.toString().concat(" - ").concat(maxB.toString())));
    $('#velocita').text(txtS.concat(minS.toString().concat(" - ").concat(maxS.toString())));
    $('#calorie').text(txtC.concat(minC.toString().concat(" - ").concat(maxC.toString())));
    $('#voto').text(txtM.concat(minM.toString().concat(" - ").concat(maxM.toString())));
}

/*** FUNZIONI DIMENSIONI ***/
function getHeight(data) {
    var h = 300;

    switch (data.length) {
        case 10:
            return h;
        default:
            return h + (((data.length - 10) / 10) * 250);
    }
}

function getWidth(data) {
    var w = 750;

    switch (data.length) {
        case 10:
            return w;
        default:
            return w + (((data.length - 10) / 10) * 250);
    }
}

function setLinechartHeight() {
    if ($('#inputQuestion').val().includes('login') && ($('#inputQuestion').val().includes('atleti con')
        || $('#inputQuestion').val().includes('migliori'))) {
        return 230;
    } else {
        return 400;
    }
}

/*** FUNZIONI LISTE E VALORI ***/
function getPercList(data, v) {
    var list = [];
    var dim = data.length, cnt = [], res = {};
    var i, j;

    if (v.includes('età') || v.includes('calorie')) {
        var max = getMax(data), min = getMin(data);
    }

    if (v.includes('calorie')) {
        list = createRangeList(min, max, 300);
    } else if (v.includes('età')) {
        list = createRangeList(min, max + 10, 15);
    }

    cnt = Array(list.length).fill(0);

    for (i = 0; i < dim; i++) {
        for (j = 0; j < list.length; j++) {
            if (data[i]['groupField'] >= list[j][0] && data[i]['groupField'] < list[j][1]) {
                cnt[j] += 1;
            }
        }
    }

    for (j = 0; j < cnt.length; j++) {
        cnt[j] = ((cnt[j] / dim) * 100).toFixed(2)
    }

    for (j = 0; j < list.length; j++) {
        res["" + list[j][0] + " - " + list[j][1] + ""] = cnt[j];
    }

    return res;
}

function getNumRes(data) {
    var i, cnt = 0;

    for (i = 0; i < data.length; i++) {
        cnt += data[i][1];
    }

    return cnt;
}

function getMax(data) {
    var max = 0, i;
    for (i = 0; i < data.length; i++) {
        if (data[i]['groupField'] > max) {
            max = data[i]['groupField']
        }
    }

    return max;
}

function getMin(data) {
    var min = 100, i;
    for (i = 0; i < data.length; i++) {
        if (data[i]['groupField'] < min) {
            min = data[i]['groupField']
        }
    }

    return min;
}

function getNewList(list, min, max) {
    var json = [];
    var i;

    var current;

    for (i = 0; i < list.length; i++) {
        current = list[i].orderField;
        if (current > min && current < max || current == min || current == max) {
            json.push(list[i])
        }
    }

    return json;
}

function createRangeList(min, max, step) {
    let arr = [];

    for (arr; (max - min) * step > 0; min += step) {
        arr.push([min, min + step]);
    }

    return arr;
}

function reset() {
    setValue($('#inputQuestion').val());
    $('#rowScatter').addClass('hidden');

    $('#rowLine').addClass('hidden');
    $('#rowLine').addClass('h-100');
    $('#rowLine').removeClass('h-40');
    $('#chooseDate').addClass('hidden');

    $('#rowBar').addClass('hidden');
    $('#rowBar').addClass('h-100');
    $('#rowBar').removeClass('h-55');
    $('#rowVer').addClass('hidden');

    $('#piechartDiv').addClass('hidden');

    $('#numres').addClass('hidden');
    $('#info').addClass('hidden');
}

function manageForm(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '',
            type: 'POST',
            data: {
                question: $('#inputQuestion').val(),
                criterio: $('#dropdownMenu4').text(),
                orderMode: $('#dropdownMenu1').text()
            },
            success: function (data) {
                data = JSON.parse(data);
                d3.select("#barchart").select("#svgBar").remove();
                d3.select("#barchartV").select("#svgBarVer").remove();
                d3.select("#linechart").select("#svgbar").remove();
                d3.select("#piechart").select("#svgPie").remove();
                d3.select("#asseX").select("#xAxis").remove();
                d3.select("#yAxis").select("g").remove();
                d3.select("#scatter").select("#svgScat").remove();
                $('#numres').text('Risultati trovati: '.concat(Object.keys(data).length));
                /*for (var i = 0; i < data.length; i++) {
                    data[i].item_user_id = fakerator.names.firstName();
                }*/

                $('#dropdownMenu4').text()
                drawCharts($('#inputQuestion').val(), data);
            },
            error: function () {
                console.log("errore 2")
            },
        })
    }
}

function manageDropdown() {
    $(".dropdown-toggle").dropdown();
    $('.dropdown-menu').on('click', 'a', function () {
        var target = $(this).closest('.dropdown').find('.dropdown-toggle')
        var selectedVal = $(this).html();
        target.html(selectedVal);
    });
}