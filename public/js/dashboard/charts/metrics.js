import chartConfig from './config.js';

class MetricsChart {
    constructor(elementId, data = [], options = {}) {
        this.elementId = elementId;
        this.data = data;
        this.options = { ...chartConfig.commonOptions, ...options };
        this.chart = null;
    }

    initialize() {
        const canvas = document.getElementById(this.elementId);
        if (!canvas) {
            console.warn(`Canvas element with id '${this.elementId}' not found`);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('Could not get 2D context for canvas');
            return;
        }

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: this.data,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    fill: true
                }]
            },
            options: this.options
        });
    }

    update(newData) {
        if (this.chart) {
            this.chart.data.datasets[0].data = newData;
            this.chart.update();
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default MetricsChart;