import { useState } from 'react';
import { Sun, Moon, Camera, CreditCard, Activity, BookOpen, Play, ShoppingBag, ChevronDown, Send, Globe } from 'lucide-react';

/* ===== THEME TYPE ===== */
type Theme = 'light' | 'dark';
type PayTab = 'cards' | 'whish' | 'wu';

function App() {
    const [theme, setTheme] = useState<Theme>('light');
    const [payTab, setPayTab] = useState<PayTab>('cards');
    const [shipping, setShipping] = useState('local');

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <div className={`app-shell theme-${theme}`}>
            {/* ===== Header Zone – Top 20% ===== */}
            <div className="zone-header">
                <h1 className="app-title">Supplement Store</h1>
                <p className="header-subtext">Complete your order</p>

                {/* Sun/Moon Toggle */}
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'light' ? (
                        <Moon size={19} strokeWidth={1.8} />
                    ) : (
                        <Sun size={19} strokeWidth={1.8} />
                    )}
                </button>
            </div>

            {/* ===== Main Zone – Middle 60% ===== */}
            <div className="zone-main zone-main--store">
                {/* Order Summary */}
                <div className="order-summary">
                    <div className="order-row">
                        <span className="order-row__label">Detox Formula A × 2</span>
                        <span className="order-row__price">$48.00</span>
                    </div>
                    <div className="order-row">
                        <span className="order-row__label">Metabolic Support × 1</span>
                        <span className="order-row__price">$32.00</span>
                    </div>
                    <div className="order-divider" />
                    <div className="order-row order-row--total">
                        <span className="order-row__label">Total</span>
                        <span className="order-row__price">$80.00</span>
                    </div>

                    {/* Weight Label */}
                    <p className="weight-label">📦 Total Weight: 450g</p>

                    {/* Shipping Selector */}
                    <div className="shipping-select-wrapper">
                        <select
                            className="shipping-select"
                            value={shipping}
                            onChange={(e) => setShipping(e.target.value)}
                        >
                            <option value="local">🇱🇧 Local Lebanon</option>
                            <option value="regional">🌍 Regional ME</option>
                            <option value="international">✈️ International</option>
                        </select>
                        <ChevronDown className="shipping-select__chevron" size={16} />
                    </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="pay-tabs">
                    <button
                        className={`pay-tab${payTab === 'cards' ? ' pay-tab--active' : ''}`}
                        onClick={() => setPayTab('cards')}
                    >
                        <CreditCard size={13} strokeWidth={1.8} />
                        Cards
                    </button>
                    <button
                        className={`pay-tab${payTab === 'whish' ? ' pay-tab--active' : ''}`}
                        onClick={() => setPayTab('whish')}
                    >
                        <Send size={13} strokeWidth={1.8} />
                        Whish/OMT
                    </button>
                    <button
                        className={`pay-tab${payTab === 'wu' ? ' pay-tab--active' : ''}`}
                        onClick={() => setPayTab('wu')}
                    >
                        <Globe size={13} strokeWidth={1.8} />
                        WU/Moneygram
                    </button>
                </div>

                {/* Dynamic Payment Content */}
                {payTab === 'cards' && (
                    <div className="pay-card-form">
                        <div className="pay-input-group">
                            <label className="pay-label">Card Number</label>
                            <input type="text" className="pay-input" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="pay-input-row">
                            <div className="pay-input-group">
                                <label className="pay-label">Expiry</label>
                                <input type="text" className="pay-input" placeholder="MM/YY" />
                            </div>
                            <div className="pay-input-group">
                                <label className="pay-label">CVV</label>
                                <input type="text" className="pay-input" placeholder="•••" />
                            </div>
                        </div>
                        <button className="cmd-pay-btn">
                            <CreditCard size={16} strokeWidth={2} />
                            Pay $80.00
                        </button>
                    </div>
                )}

                {payTab === 'whish' && (
                    <div className="pay-manual-flow">
                        <div className="pay-instruction">
                            <p className="pay-instruction__title">Reference Info</p>
                            <p className="pay-instruction__text">
                                Send to: <strong>Philippe — 03-XXXXXX</strong>
                            </p>
                        </div>
                        <button className="upload-box" aria-label="Upload receipt">
                            <Camera className="upload-box__icon" size={30} strokeWidth={1.4} />
                            <span className="upload-box__label">Upload Transfer Receipt/Screenshot</span>
                        </button>
                        <div className="status-badge status-badge--pending">
                            ⏳ Awaiting Admin Approval
                        </div>
                    </div>
                )}

                {payTab === 'wu' && (
                    <div className="pay-manual-flow">
                        <div className="pay-instruction">
                            <p className="pay-instruction__title">Reference Info</p>
                            <p className="pay-instruction__text">
                                Send to: <strong>Philippe Moussaoui</strong>
                            </p>
                            <p className="pay-instruction__sub">
                                Via Western Union or Moneygram. Upload MTCN receipt after transfer.
                            </p>
                        </div>
                        <button className="upload-box" aria-label="Upload receipt">
                            <Camera className="upload-box__icon" size={30} strokeWidth={1.4} />
                            <span className="upload-box__label">Upload Transfer Receipt/Screenshot</span>
                        </button>
                        <div className="status-badge status-badge--pending">
                            ⏳ Awaiting Admin Approval
                        </div>
                    </div>
                )}
            </div>

            {/* ===== Footer Zone – Bottom 20% ===== */}
            <div className="zone-footer zone-footer--nav">
                <nav className="nav-bar">
                    <button className="nav-item">
                        <Activity size={20} strokeWidth={1.6} />
                        <span>Vitality</span>
                    </button>
                    <button className="nav-item">
                        <BookOpen size={20} strokeWidth={1.6} />
                        <span>Journey</span>
                    </button>
                    <button className="nav-item">
                        <Play size={20} strokeWidth={1.6} />
                        <span>Vault</span>
                    </button>
                    <button className="nav-item nav-item--active">
                        <ShoppingBag size={20} strokeWidth={1.6} />
                        <span>Store</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default App;
