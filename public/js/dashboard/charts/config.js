// Chart.js configuration and defaults
const chartConfig = {
    defaults: {
        color: '#94a3b8',
        borderColor: '#e2e8f0',
        font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
    },

    commonOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#64748b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        return ` ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawBorder: false,
                    color: '#f1f5f9'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#64748b'
                }
            },
            y: {
                grid: {
                    display: true,
                    drawBorder: false,
                    color: '#f1f5f9'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#64748b',
                    padding: 8
                }
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2,
                fill: true
            },
            point: {
                radius: 0,
                hoverRadius: 6
            }
        }
    }
};

export default chartConfig;