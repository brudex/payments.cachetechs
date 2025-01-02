const PAYMENT_MODES = {
    CARD: 'card',
    WALLET: 'wallet',
    CRYPTO: 'crypto'
};

const PAYMENT_MODE_LABELS = {
    [PAYMENT_MODES.CARD]: 'Credit/Debit Card',
    [PAYMENT_MODES.WALLET]: 'Mobile Money Wallet',
    [PAYMENT_MODES.CRYPTO]: 'Cryptocurrency'
};

const DEFAULT_PAYMENT_MODES = [PAYMENT_MODES.CARD];

module.exports = {
    PAYMENT_MODES,
    PAYMENT_MODE_LABELS,
    DEFAULT_PAYMENT_MODES
};