$(function () {
    'use strict';

    const FONT_COLOR = Sing.colors['gray-400'];

    let debouncedTimeout = 0;

    class DonutChart {
        constructor(data) {
            this.$chartContainer = $('#flot-donut');
            this.chart = this.createChart(data);
        }

        createChart(data) {
            return $.plot(this.$chartContainer, data, {
                series: {
                    pie: {
                        innerRadius: 0.6,
                        show: true,
                        fill: 1,
                        stroke: {
                            width: 0
                        }
                    }
                },
                colors: [
                    Sing.colors['brand-primary'],
                    Sing.colors['brand-danger'],
                    Sing.colors['brand-info']
                ],
                legend: {
                    noColumns: 1,
                    container: $('#flot-donut-legend'),
                    labelBoxBorderColor: Sing.colors['white']
                }
            });
        }
    }

    class LineChart {
        constructor(color, containerId) {
            this.$container = $(containerId);
            this.chart = this.createChart(color);
        }

        createChart(color) {
            const randomData = [];

            for (let i = 0; i < 40; i++) {
                randomData.push((i/9+Math.sin(i/6)*8+Math.random() * 2).toFixed(2));
            }

            return this.$container.sparkline(randomData, {
                type: 'line',
                lineWidth: 1.67,
                lineColor: Sing.colors[color],
                normalRangeMin: '10px',
                width: '160px',
                height: '20px',
                fillColor: false,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                highlightSpotColor: false,
                highlightLineColor: false,
                drawNormalOnTop: false,
                tooltipClassname: 'line-chart-tooltip'
            });
        }
    }

    class MainChart {
        constructor(data, container, tooltipContainer, legendContainer) {
            this.$chart = container;
            this.$tooltip = tooltipContainer;
            this.$legend = legendContainer;

            this.chart = this.createChart(data);
            this.initEventListeners();
        }

        createChart(data) {
            let ticks = ['Dec 19', 'Dec 25', 'Dec 31', 'Jan 10', 'Jan 14',
                'Jan 20', 'Jan 27', 'Jan 30', 'Feb 2', 'Feb 8', 'Feb 15',
                'Feb 22', 'Feb 28', 'Mar 7', 'Mar 17'];

            // check the screen size and either show tick for every 4th tick on large screens, or
            // every 8th tick on mobiles
            let tickInterval = screen.width < 500 ? 10 : 6;
            let counter = 0;

            return $.plot(this.$chart, [{
                label: "Light Blue",
                data: data[0],
                lines: {
                    show: true,
                    fill: .45,
                    lineWidth: 0
                },
                points: {
                    fillColor: Sing.palette['brand-primary'],
                    symbol: (ctx, x, y, radius, shadow, i) => {
                        // count for every 8nd point to show on line
                        if (counter % 8 === 0)
                            ctx.arc(x, y, 2, 0, Math.PI * 2, false);

                        counter++;
                    }
                },
                shadowSize: 0
            }, {
                label: "RNS App",
                data: data[1],
                points: {
                    fillColor: Sing.colors['brand-danger']
                },
                shadowSize: 0
            }, {
                label: "Sing App",
                data: data[2],
                lines: {
                    show: true,
                    lineWidth: 2.5
                },
                points: {
                    fillColor: Sing.colors['brand-warning'],

                },
                shadowSize: 0
            }], {
                xaxis: {
                    tickColor: "#fafbfc",
                    tickSize: tickInterval,
                    tickFormatter: (i) => {
                        return ticks[i / tickInterval];
                    },
                    font: {
                        lineHeight: 11,
                        weight: 400,
                        color: FONT_COLOR
                    }
                },
                yaxis: {

                    max: 5,
                    font: {
                        lineHeight: 11,
                        weight: 400,
                        color: FONT_COLOR
                    }
                },
                grid: {
                    backgroundColor: {colors: [Sing.colors['white'], Sing.colors['white']]},
                    borderWidth: 1,
                    borderColor: Sing.colors['white'],
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 20,
                    hoverable: true,
                    clickable: true,
                    mouseActiveRadius: 6
                },
                legend: {
                    noColumns: 3,
                    container: this.$legend
                },
                colors: [
                    "#1a88d0",
                    Sing.colors['brand-primary'],
                    Sing.colors['brand-danger']
                ],
                hooks: {
                    draw: [this.onDrawHook.bind(this)]
                }
            });
        }

        onDrawHook() {
            this.$legend
                .find('.legendColorBox > div')
                .css({
                    border: 0,
                    borderRadius: 0,
                    paddingTop: 5
                })
                .children('div')
                .css({
                    borderWidth: 1,
                    borderRadius: 0,
                    width: 75
                });

            this.$legend.find('tbody td').css({
                paddingLeft: 10,
                paddingRight: 10,
                textAlign: 'center'
            });

            let labels = this.$legend.find('.legendLabel').detach();
            this.$legend.find('tbody').prepend('<tr></tr>');
            this.$legend.find('tbody tr:eq(0)').append(labels);
        }

        initEventListeners() {
            let self = this;

            this.$chart.on("plothover", function (event, pos, item) {
                if (item) {
                    let x = item.datapoint[0].toFixed(2);
                    let y = item.datapoint[1].toFixed(2);

                    self.$tooltip.html(item.series.label + " at " + x + " : " + y)
                        .css({
                            top: item.pageY + 5 - window.scrollY,
                            left: item.pageX + 5 - window.scrollX
                        })
                        .fadeIn(200);
                } else {
                    self.$tooltip.hide();
                }
            });
        }
    }

    function createCharts() {
        new DonutChart(getPieChartData());
        new LineChart('brand-danger', '#sparkline');
        new LineChart('brand-primary', '#sparkline-1');
        new LineChart('brand-info', '#sparkline-2');
        new MainChart(getMainChartData(), $("#main-chart"), $('#main-chart-tooltip'), $('#main-chart-legend'));
    }

    function resizeCharts() {
        if (!debouncedTimeout) {
            debouncedTimeout = 400;

            setTimeout(() => {
                debouncedTimeout = 0;
                createCharts()
            }, debouncedTimeout);
        }
    }

    function initCalendar() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dayNames = ["S", "M", "T", "W", "T", "F", "S"];
        var now = new Date(),
            month = now.getMonth() + 1,
            year = now.getFullYear();
        var events = [
            [
                "2/" + month + "/" + year,
                'The flower bed',
                '#',
                Sing.colors['brand-primary'],
                'Contents here'
            ],
            [
                "5/" + month + "/" + year,
                'Stop world water pollution',
                '#',
                Sing.colors['brand-warning'],
                'Have a kick off meeting with .inc company'
            ],
            [
                "18/" + month + "/" + year,
                'Light Blue 2.2 release',
                '#',
                Sing.colors['brand-success'],
                'Some contents here'
            ],
            [
                "29/" + month + "/" + year,
                'A link',
                'http://www.flatlogic.com',
                Sing.colors['brand-danger']
            ]
        ];
        var $calendar = $('#events-calendar');
        $calendar.calendar({
            months: monthNames,
            days: dayNames,
            events: events,
            popover_options: {
                placement: 'top',
                html: true
            }
        });

        $calendar.find('.icon-arrow-left').addClass('fa fa-angle-left ml-xs');
        $calendar.find('.icon-arrow-right').addClass('fa fa-angle-right mr-xs');

        function restyleCalendar() {
            $calendar.find('.event').each(function () {
                var $this = $(this),
                    $eventIndicator = $('<span></span>');
                $eventIndicator.css('background-color', $this.css('background-color')).appendTo($this.find('a'));
                $this.css('background-color', '');
            })
        }

        $calendar.find('.icon-arrow-left, .icon-arrow-right').parent().on('click', restyleCalendar);
        restyleCalendar();
    }

    function initTasks() {
        const $tasksContainer = $('.task-container');
        const $tasksStat = $('.tasks-stat')[0];
        changeTasksStat();

        $('.task').on('change', function () {
            const $task = $(this);
            const checked = $task.hasClass('checked');

            checked ? $task.removeClass('checked') : $task.addClass('checked');

            changeTasksStat();
        });

        function changeTasksStat() {
            const numberOfCompleted = $tasksContainer.children('.checked').length;

            $tasksStat.innerHTML = `${numberOfCompleted} of 11 completed`;
        }
    }

    function pageLoad() {
        $('.widget').widgster();
        $('.selectpicker').selectpicker();

        createCharts();
        initCalendar();
        initTasks();
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
    SingApp.onResize(resizeCharts);
});

function getPieChartData() {
    let data = [];
    let seriesCount = 3;
    let accessories = ['SMX', 'Direct', 'Networks'];

    for (let i = 0; i < seriesCount; i++) {
        data.push({
            label: accessories[i],
            data: Math.floor(Math.random() * 100) + 1
        });
    }

    return data;
}

function getMainChartData() {
    let d1 = generateRandomPicks(0.2, 3, 4, 90);
    let d2 = generateRandomPicks(0.4, 3.8, 4, 90);
    let d3 = generateRandomPicks(0.2, 4.2, 3, 90);

    function generateRandomPicks(minPoint, maxPoint, picksAmount, xMax) {
        let x = 0;
        let y = 0;
        let result = [];
        let xStep = 1;
        let smoothness = 0.3;
        let pointsPerPick = Math.ceil(xMax / (picksAmount * 2 + 1) / 2);

        let maxValues = [];
        let minValues = [];

        for (let i = 0; i < picksAmount; i++) {
            let minResult = minPoint + Math.random();
            let maxResult = maxPoint - Math.random();

            minValues.push(minResult);
            maxValues.push(maxResult);
        }

        let localMax = maxValues.shift(0);
        let localMin = 0;
        let yStep = parseFloat(((localMax - localMin) / pointsPerPick).toFixed(2));

        for (let j = 0; j < Math.ceil(xMax); j++) {
            result.push([x, y]);

            if ((y + yStep >= localMax) || (y + yStep <= localMin)) {
                y += yStep * smoothness;
            } else if ((result[result.length - 1][1] === localMax) || (result[result.length - 1][1] === localMin)) {
                y += yStep * smoothness;
            } else {
                y += yStep;
            }

            if (y > localMax) {
                y = localMax;
            } else if (y < localMin) {
                y = localMin;
            }

            if (y === localMin) {
                localMax = maxValues.shift(0) || localMax;

                let share = (localMax - localMin)/localMax;
                let p = share > 0.5 ? Math.round(pointsPerPick * 1.2) : Math.round(pointsPerPick * share);

                yStep = parseFloat(((localMax - localMin) / p).toFixed(2));
                yStep *= Math.abs(yStep);
            }

            if (y === localMax) {
                localMin = minValues.shift(0) || localMin;

                let share = (localMax - localMin)/localMax;
                let p = share > 0.5 ? Math.round(pointsPerPick * 1.5) : Math.round(pointsPerPick * 0.5);

                yStep = parseFloat(((localMax - localMin) / p).toFixed(2));
                yStep *= -1;
            }

            x += xStep;
        }

        return result;
    }

    return [d1, d2, d3];
}
