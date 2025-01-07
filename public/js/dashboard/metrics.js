import MetricsChart from './charts/metrics.js';

class DashboardMetrics {
    constructor() {
        this.charts = new Map();
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        // Set Chart.js defaults
        if (window.Chart) {
            Object.assign(Chart.defaults, {
                color: '#94a3b8',
                borderColor: '#e2e8f0',
                font: {
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }
            });
        }

        // Initialize charts
        const chartIds = ['transactionsChart', 'revenueChart', 'appsChart'];
        const mockData = [65, 59, 80, 81, 56, 55, 70];

        chartIds.forEach(id => {
            try {
                const chart = new MetricsChart(id, mockData);
                chart.initialize();
                this.charts.set(id, chart);
            } catch (error) {
                console.error(`Failed to initialize chart ${id}:`, error);
            }
        });

        this.loadRecentTransactions();
        this.initialized = true;
    }

    async loadRecentTransactions() {
        try {
            const response = await fetch('/api/transactions?limit=5');
            const data = await response.json();

            const tableBody = document.getElementById('transactionsTableBody');
            if (!tableBody) {
                console.warn('Transactions table body not found');
                return;
            }

            if (!data.data?.length) {
                this.showEmptyState(tableBody);
                return;
            }

            this.renderTransactions(tableBody, data.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.showError();
        }
    }

    renderTransactions(tableBody, transactions) {
        tableBody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>${transaction.transactionId}</td>
                <td>${transaction.currency} ${transaction.amount}</td>
                <td>
                    <i class="fas ${this.getPaymentIcon(transaction.paymentMode)} me-1"></i>
                    ${transaction.paymentMode}
                </td>
                <td>
                    <span class="status-badge status-${transaction.paymentStatus.toLowerCase()}">
                        ${transaction.paymentStatus}
                    </span>
                </td>
                <td>${new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    showEmptyState(tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-receipt fa-2x text-gray-400 mb-2"></i>
                        <p class="text-gray-500">No transactions yet</p>
                        <a href="/dashboard/apps" class="btn btn-sm btn-primary mt-2">
                            Create Your First App
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }

    showError() {
        const tableBody = document.getElementById('transactionsTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <div class="error-state">
                            <i class="fas fa-exclamation-circle fa-2x text-danger mb-2"></i>
                            <p class="text-danger">Failed to load transactions</p>
                            <button onclick="window.location.reload()" class="btn btn-sm btn-outline-primary mt-2">
                                Try Again
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    getPaymentIcon(mode) {
        const icons = {
            card: 'fa-credit-card',
            wallet: 'fa-wallet',
            crypto: 'fa-coins'
        };
        return icons[mode] || 'fa-money-bill';
    }

    destroy() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
        this.initialized = false;
    }
}

// Initialize dashboard
const dashboard = new DashboardMetrics();
document.addEventListener('DOMContentLoaded', () => dashboard.initialize());

// Export for potential reuse
export default dashboard;