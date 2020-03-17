$(function () {
    'use strict';

    const COLORS = {
        lineChart: [Sing.colors['brand-warning'], Sing.colors['brand-info'], Sing.colors['brand-primary']],
        barChart: Object.values(Sing.colors).slice(13),
        trackingChart: [Sing.colors['brand-danger'], Sing.colors['brand-info']],
        pieChart: [Sing.colors['brand-warning'], Sing.colors['brand-info'], Sing.colors['brand-success'], Sing.colors['brand-danger']],
        markers: Object.values(Sing.colors).slice(11),
        donutChart: Object.values(Sing.colors).slice(12),
        fontColor: Sing.colors['gray-400'],
        gridBorder: [Sing.colors['brand-warning'], Sing.colors['brand-info'], Sing.colors['brand-primary']]
    };
    let debouncedTmeout = 0;

    class StackedLineChart {
        constructor(data) {
            this.$chartContainer = $("#flot-main");
            this.$tooltip = $('#flot-main-tooltip');

            this.chart = this.createChart(data);
            this.initEventListeners();
        }

        createChart(data) {
            return $.plotAnimator(this.$chartContainer, [{
                label: "Traffic",
                data: data[2],
                lines: {
                    fill: 1,
                    lineWidth: 0
                }
            }, {
                label: "Traffic",
                data: data[1],
                lines: {
                    fill: 1,
                    lineWidth: 0
                }
            }, {
                label: "Traffic",
                data: data[0],
                animator: {steps: 60, duration: 1000, start: 0},
                lines: {lineWidth: 2},
                shadowSize: 0
            }], {
                xaxis: {
                    tickLength: 0,
                    tickDecimals: 0,
                    min: 2,
                    font: {
                        lineHeight: 13,
                        weight: "bold",
                        color: COLORS.fontColor
                    }
                },
                yaxis: {
                    tickDecimals: 0,
                    tickColor: Sing.colors['gray-100'],
                    font: {
                        lineHeight: 13,
                        weight: "bold",
                        color: COLORS.fontcolor
                    }
                },
                grid: {
                    backgroundColor: {colors: [Sing.colors['white'], Sing.colors['white']]},
                    borderWidth: 1,
                    borderColor: COLORS.gridBorder,
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 20,
                    hoverable: true,
                    clickable: true,
                    mouseActiveRadius: 6
                },
                legend: false,
                colors: COLORS.lineChart
            });
        }

        initEventListeners() {
            let self = this;

            this.$chartContainer.on("plothover", function (event, pos, item) {
                if (item) {
                    let x = item.datapoint[0].toFixed(2);
                    let y = item.datapoint[1].toFixed(2);

                    self.$tooltip.html(item.series.label + " at " + x + ": " + y)
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

    class BarChart {
        constructor(data) {
            this.$chartContainer = $("#flot-bar");
            this.chart = this.createChart(this.getDataSeries(data));
        }

        getDataSeries(data) {
            return [{
                label: "Apple",
                data: data[0],
                bars: {
                    show: true,
                    barWidth: 12 * 24 * 60 * 60 * 300,
                    lineWidth: 0,
                    order: 1
                }
            }, {
                label: "Google",
                data: data[1],
                bars: {
                    show: true,
                    barWidth: 12 * 24 * 60 * 60 * 300,
                    lineWidth: 0,
                    order: 2
                }
            }, {
                label: "Facebook",
                data: data[2],
                bars: {
                    show: true,
                    barWidth: 12 * 24 * 60 * 60 * 300,
                    lineWidth: 0,
                    order: 3
                }
            }

            ];
        }

        createChart(dataSeries) {
            return $.plot(this.$chartContainer, dataSeries, {
                series: {
                    bars: {
                        show: true,
                        barWidth: 12 * 24 * 60 * 60 * 350,
                        lineWidth: 0,
                        order: 1,
                        fillColor: {
                            colors: [{
                                opacity: 1
                            }, {
                                opacity: 0.9
                            }]
                        }
                    }
                },
                xaxis: {
                    mode: "time",
                    min: 1387497600000,
                    max: 1400112000000,
                    tickLength: 0,
                    tickSize: [1, "month"],
                    axisLabel: 'Month',
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 13,
                    axisLabelPadding: 15
                },
                yaxis: {
                    axisLabel: 'Value',
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 13,
                    axisLabelPadding: 5
                },
                grid: {
                    hoverable: true,
                    borderWidth: 0
                },
                legend: {
                    backgroundColor: "transparent",
                    labelBoxBorderColor: "none"
                },
                colors: COLORS.barChart
            });
        }
    }

    class TrackingChart {
        constructor(data) {
            this.$chartContainer = $("#flot-tracking");
            this.chart = this.createChart(data);
            this.legend = this.$chartContainer.find(".legendLabel");
            this.initEventListeners();
        }

        createChart(data) {
            return $.plotAnimator(this.$chartContainer, [{
                label: data[0].label,
                data: data[0].data
            }, {
                label: data[1].label,
                data: data[1].data,
                animator: {steps: 60, duration: 1000, start: 0},
            }], {
                series: {
                    lines: {
                        show: true
                    }
                },
                colors: COLORS.trackingChart,
                crosshair: {
                    mode: "x",
                    color: Sing.colors['brand-danger']
                },
                grid: {
                    hoverable: true,
                    autoHighlight: false,
                    backgroundColor: {colors: [Sing.colors['white'], Sing.colors['white']]},
                    borderWidth: 1,
                    borderColor: COLORS.gridBorder,
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 40,
                    mouseActiveRadius: 6
                },
                xaxis: {
                    tickLength: 0,
                    tickDecimals: 0,
                    min: 1,
                    max: 6,
                    font: {
                        lineHeight: 13,
                        weight: "bold",
                        color: Sing.colors['gray-400']
                    }
                },
                yaxis: {
                    min: -1.2,
                    max: 1.2,
                    tickDecimals: 0,
                    font: {
                        lineHeight: 13,
                        weight: "bold",
                        color: Sing.colors['gray-400']
                    }
                }
            })
        }

        initEventListeners() {
            let self = this;

            this.$chartContainer.bind("plothover", function (event, pos) {
                if (!self.updateLegendTimeout) {
                    self.updateLegendTimeout = setTimeout(self.updateLegendContent.bind(self, event, pos), 50);
                }
            });
        }

        updateLegendContent(event, pos) {
            this.updateLegendTimeout = null;

            let axes = this.chart.getAxes();
            if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
                pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
                return;
            }

            let dataset = this.chart.getData();
            for (let i = 0; i < dataset.length; ++i) {
                let series = dataset[i];
                let point1;
                let point2;

                // Find the nearest points, x-wise
                for (let j = 0; j < series.data.length; ++j) {
                    if (series.data[j][0] > pos.x) {
                        point1 = series.data[j - 1];
                        point2 = series.data[j];
                        break;
                    }
                }

                let y;
                // Now Interpolate
                if (point1 == null && point2) {
                    y = point2[1];
                } else if (point2 == null && point1) {
                    y = point1[1];
                } else {
                    y = point1[1] + (point2[1] - point1[1]) * (pos.x - point1[0]) / (point2[0] - point1[0]);
                }

                this.legend.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
            }
        }
    }

    class PieChart {
        constructor(data) {
            this.$chartContainer = $('#flot-pie');
            this.chart = this.createChart(data);
        }

        createChart(data) {
            let self = this;

            return $.plot(this.$chartContainer, data, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        stroke: {
                            width: 0
                        },
                        label: {
                            show: true,
                            radius: 2 / 3,
                            formatter: self.labelFormatter,
                            threshold: 0.2
                        }
                    }
                },
                legend: {
                    show: false
                },
                colors: COLORS.pieChart

            });
        }

        labelFormatter(label, series) {
            return `<h1><span class="badge badge-secondary">${label}: ${Math.round(series.percent)}%</span></h1>`;
        }

    }

    class DonutChart {
        constructor(data) {
            this.$chartContainer = $('#flot-donut');
            this.chart = this.createChart(data);
        }

        createChart(data) {
            return $.plot(this.$chartContainer, data, {
                series: {
                    pie: {
                        innerRadius: 0.5,
                        show: true,
                        fill: 0.1,
                        stroke: {
                            width: 0
                        }
                    }
                },
                colors: COLORS.donutChart,
                legend: {
                    noColumns: 1,
                    container: $('#flot-donut-legend')
                }
            });
        }
    }

    class stackedBarChart {
        constructor(data) {
            this.$chartContainer = $('#flot-bar-stacked');
            this.chart = this.createChart(data);
        }

        createChart(data) {
            return $.plot(this.$chartContainer, data, {
                series: {
                    stack: true,
                    bars: {
                        show: true,
                        barWidth: 0.45,
                        lineWidth: 1,
                        fill: 1
                    }
                },
                grid: {
                    backgroundColor: {colors: [Sing.colors['white'], Sing.colors['white']]},
                    borderWidth: 1,
                    borderColor: COLORS.gridBorder,
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 20,
                    hoverable: true,
                    clickable: true,
                    mouseActiveRadius: 6
                },
                xaxis: {
                    min: 1,
                    tickLength: 0,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 13,
                    axisLabelPadding: 15
                },
                colors: Object.values(Sing.colors).slice(13)
            });
        }
    }

    class Markers {
        constructor() {
            this.data = [
                { data: this.generate(2, 0.6), points: { symbol: "circle" } },
                { data: this.generate(3, 0.5), points: { symbol: "square" } },
                { data: this.generate(4, 0.8), points: { symbol: "diamond" } },
                { data: this.generate(6, 0.7), points: { symbol: "triangle" } },
                { data: this.generate(7, 0.2), points: { symbol: "cross" } }
            ];

            this.$chartContainer = $('#flot-markers');
            this.chart = this.createChart(this.data);
        }

        generate(offset, amplitude) {
            let result = [];
            let start = 0;
            let end = 10;
            let point;

            for (let i = 0; i <= 50; i++) {
                point = start + i / 50 * (end - start);
                result.push([point, amplitude * Math.sin(point + offset)]);
            }

            return result;
        }

        createChart(data) {
            return $.plot(this.$chartContainer, data, {
                series: {
                    points: {
                        show: true,
                        radius: 3
                    }
                },
                yaxis: {
                    ticks: []
                },
                xaxis: {
                    min: 1
                },
                grid: {
                    hoverable: true,
                    backgroundColor: {colors: [Sing.colors['white'], Sing.colors['white']]},
                    borderWidth: 1,
                    borderColor: COLORS.gridBorder
                },
                colors: COLORS.markers
            });
        }
    }

    function pageLoad() {
        $('.widget').widgster();
        $('.sparkline').each(function () {
            $(this).sparkline('html', $(this).data());
        });

        createCharts();
    }

    function createCharts() {
        new StackedLineChart(getLineChartData());
        new BarChart(getBarChartData());
        new TrackingChart(getTrackingChartData());
        new PieChart(getPieChartData());
        new DonutChart(getPieChartData());
        new stackedBarChart(getstackedBarChartData());
        new Markers();
    }

    function resizeCharts() {
        if (!debouncedTmeout) {
            debouncedTmeout = 400;

            setTimeout(() => {
                debouncedTmeout = 0;
                createCharts()
            }, debouncedTmeout);
        }

    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
    SingApp.onResize(resizeCharts);
});

function getLineChartData() {
    return [
        [
            [1, 20],
            [2, 20],
            [3, 40],
            [4, 30],
            [5, 40],
            [6, 35],
            [7, 47]
        ], [
            [1, 13],
            [2, 8],
            [3, 17],
            [4, 10],
            [5, 17],
            [6, 15],
            [7, 16]
        ], [
            [1, 23],
            [2, 13],
            [3, 33],
            [4, 16],
            [5, 32],
            [6, 28],
            [7, 31]
        ]
    ]
}

function getBarChartData() {
    return [
        [[1388534400000, 120], [1391212800000, 70], [1393632000000, 100], [1396310400000, 60], [1398902400000, 35]],
        [[1388534400000, 90], [1391212800000, 60], [1393632000000, 30], [1396310400000, 73], [1398902400000, 30]],
        [[1388534400000, 80], [1391212800000, 40], [1393632000000, 47], [1396310400000, 22], [1398902400000, 24]]
    ]
}

function getTrackingChartData() {
    let sin = [];
    let cos = [];
    for (let i = 0; i < 14; i += 0.1) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
    }

    return [
        {data: sin, label: "sin(x) = -0.00"},
        {data: cos, label: "cos(x) = -0.00"}
    ];
}

function getPieChartData() {
    let data = [];
    let seriesCount = 4;
    let accessories = ['Rolex', 'Tissot', 'Orient', 'Other'];

    for (let i = 0; i < seriesCount; i++) {
        data.push({
            label: accessories[i],
            data: Math.floor(Math.random() * 100) + 1
        });
    }

    return data;
}

function getstackedBarChartData() {
    let seriesCount = 3;
    let tickCount = 10;
    let series = [];
    let data = [];

    for (let i = 0; i < seriesCount; i++) {
        series = [];

        for (let j = 0; j < tickCount; j++) {
            series.push([j, parseInt(Math.random() * 30)])
        }

        data.push(series);
    }

    return data;
}