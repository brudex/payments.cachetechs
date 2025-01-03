// Transaction History Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable
    const table = $('#transactionsTable').DataTable({
        serverSide: true,
        ajax: {
            url: '/api/transactions',
            data: function(d) {
                const filters = new FormData(document.getElementById('transactionFilters'));
                for(let pair of filters.entries()) {
                    d[pair[0]] = pair[1];
                }
            }
        },
        columns: [
            { data: 'transactionId' },
            { data: 'orderId' },
            { 
                data: 'amount',
                render: function(data, type, row) {
                    return new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2
                    }).format(data);
                }
            },
            { data: 'currency' },
            { data: 'paymentMode' },
            { 
                data: 'paymentStatus',
                render: function(data) {
                    const statusClasses = {
                        'COMPLETED': 'success',
                        'PENDING': 'warning',
                        'FAILED': 'danger',
                        'CANCELLED': 'secondary'
                    };
                    return `<span class="badge bg-${statusClasses[data] || 'primary'}">${data}</span>`;
                }
            },
            { data: 'orderDescription' },
            { 
                data: 'createdAt',
                render: function(data) {
                    return new Date(data).toLocaleString();
                }
            },
            {
                data: null,
                render: function(data) {
                    return `<button class="btn btn-sm btn-outline-primary view-details" data-id="${data.transactionId}">
                        <i class="fas fa-eye"></i>
                    </button>`;
                }
            }
        ],
        order: [[7, 'desc']],
        pageLength: 10,
        dom: 'rtip'
    });

    // Handle filter form submission
    document.getElementById('transactionFilters').addEventListener('submit', function(e) {
        e.preventDefault();
        table.ajax.reload();
    });

    // Export handlers
    document.getElementById('exportExcel').addEventListener('click', () => exportData('excel'));
    document.getElementById('exportCsv').addEventListener('click', () => exportData('csv'));
    document.getElementById('exportPdf').addEventListener('click', () => exportData('pdf'));

    // View transaction details
    $('#transactionsTable').on('click', '.view-details', async function() {
        const transactionId = $(this).data('id');
        try {
            const response = await fetch(`/api/transactions/${transactionId}`);
            const transaction = await response.json();
            
            const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
            document.getElementById('transactionDetails').innerHTML = formatTransactionDetails(transaction);
            modal.show();
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            alert('Failed to load transaction details');
        }
    });
});

// Helper Functions
function formatTransactionDetails(transaction) {
    return `
        <div class="transaction-details">
            <div class="row">
                <div class="col-md-6">
                    <h6>Basic Information</h6>
                    <dl class="row">
                        <dt class="col-sm-4">Transaction ID</dt>
                        <dd class="col-sm-8">${transaction.transactionId}</dd>
                        
                        <dt class="col-sm-4">Order ID</dt>
                        <dd class="col-sm-8">${transaction.orderId}</dd>
                        
                        <dt class="col-sm-4">Amount</dt>
                        <dd class="col-sm-8">${transaction.currency} ${transaction.amount}</dd>
                        
                        <dt class="col-sm-4">Status</dt>
                        <dd class="col-sm-8">${transaction.paymentStatus}</dd>
                    </dl>
                </div>
                <div class="col-md-6">
                    <h6>Payment Details</h6>
                    <dl class="row">
                        <dt class="col-sm-4">Payment Mode</dt>
                        <dd class="col-sm-8">${transaction.paymentMode}</dd>
                        
                        <dt class="col-sm-4">Provider</dt>
                        <dd class="col-sm-8">${transaction.paymentProvider}</dd>
                        
                        <dt class="col-sm-4">Mobile Number</dt>
                        <dd class="col-sm-8">${transaction.mobileNumber || 'N/A'}</dd>
                    </dl>
                </div>
            </div>
            
            <hr>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Additional Information</h6>
                    <dl class="row">
                        <dt class="col-sm-2">Description</dt>
                        <dd class="col-sm-10">${transaction.orderDescription}</dd>
                        
                        <dt class="col-sm-2">Created At</dt>
                        <dd class="col-sm-10">${new Date(transaction.createdAt).toLocaleString()}</dd>
                        
                        <dt class="col-sm-2">Status Message</dt>
                        <dd class="col-sm-10">${transaction.statusMessage || 'N/A'}</dd>
                    </dl>
                </div>
            </div>
        </div>
    `;
}

async function exportData(format) {
    const filters = new FormData(document.getElementById('transactionFilters'));
    const queryString = new URLSearchParams(filters).toString();
    
    try {
        const response = await fetch(`/api/transactions/export/${format}?${queryString}`);
        if (!response.ok) throw new Error('Export failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data');
    }
}