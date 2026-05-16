import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProducts, placeOrder } from '../services/api';
import { Home, AlertCircle, MapPin, Search, ShoppingBag, Plus, Minus, Trash2, Phone, X, CheckCircle } from 'lucide-react';

const OrderPage = () => {
    const { phone } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const customer = location.state?.customer || { phoneNumber: phone, name: 'Guest', address: '' };

    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [isAsap, setIsAsap] = useState(true);
    const [scheduledTime, setScheduledTime] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    
    // Modal states
    const [showConcernModal, setShowConcernModal] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [concernMsg, setConcernMsg] = useState('');
    const [trackOrderId, setTrackOrderId] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await getProducts();
                setMenu(res.data);
            } catch (error) {
                console.error("Error fetching menu", error);
            }
        };
        fetchMenu();
    }, []);

    const addToCart = (product, customization) => {
        const existingItem = cart.find(item => item.product.id === product.id && item.customization === customization);
        if (existingItem) {
            setCart(cart.map(item => 
                (item.product.id === product.id && item.customization === customization) 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1, customization }]);
        }
    };

    const updateQuantity = (product, customization, delta) => {
        setCart(cart.map(item => {
            if (item.product.id === product.id && item.customization === customization) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'VOICECART100') {
            setCouponApplied(true);
        } else {
            alert('Invalid coupon code');
            setCouponApplied(false);
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = couponApplied ? Math.min(subtotal, 10) : 0; // $10 off
    const tax = (subtotal - discount) * 0.05; // 5% tax
    const total = subtotal - discount + tax;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return alert("Cart is empty");
        
        try {
            const orderPayload = {
                customerId: customer.id || 1, // Fallback for guest
                deliveryAddress: customer.address,
                isAsap: isAsap,
                scheduledTime: !isAsap ? scheduledTime : null,
                couponCode: couponApplied ? 'VOICECART100' : null,
                subtotal: subtotal,
                taxAmount: tax,
                totalAmount: total,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    customization: item.customization
                }))
            };

            const res = await placeOrder(orderPayload);
            setOrderSuccess(res.data.orderNumber);
            setCart([]);
        } catch (error) {
            console.error(error);
            alert("Failed to place order");
        }
    };

    const handleConcernSubmit = (e) => {
        e.preventDefault();
        alert(`Concern raised successfully for customer ${customer.phoneNumber}. Ticket ID: TKT-${Math.floor(Math.random()*10000)}`);
        setShowConcernModal(false);
        setConcernMsg('');
    };

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        alert(`Order ${trackOrderId} is currently OUT FOR DELIVERY. Expected in 15 mins.`);
        setShowTrackModal(false);
        setTrackOrderId('');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Top Navbar specifically for Order Page */}
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button className="btn" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }} onClick={() => navigate('/workspace')}>
                        <Home size={18} /> Home
                    </button>
                    <button className="btn" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }} onClick={() => setShowConcernModal(true)}>
                        <AlertCircle size={18} /> Raise Concern
                    </button>
                    <button className="btn" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }} onClick={() => setShowTrackModal(true)}>
                        <Search size={18} /> Track Order
                    </button>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>VoiceCart Order Portal</div>
            </div>

            <div className="container" style={{ paddingTop: '2rem' }}>
                
                {orderSuccess && (
                    <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #34d399' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={24} />
                            <strong style={{ fontSize: '1.1rem' }}>Success! Order #{orderSuccess} placed successfully.</strong>
                        </div>
                        <button className="btn btn-success" onClick={() => setOrderSuccess(null)}>Close</button>
                    </div>
                )}

                {/* Header Section */}
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderLeft: '4px solid var(--primary-color)' }}>
                    <div>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-dark)' }}>{customer.name}</h2>
                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {customer.phoneNumber}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {customer.address || 'No address provided'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3" style={{ gap: '2rem', marginTop: '1.5rem' }}>
                    {/* Menu Section (2 columns wide) */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Menu Categories</h3>
                        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                            {menu.map(product => (
                                <ProductCard key={product.id} product={product} onAdd={addToCart} />
                            ))}
                        </div>
                    </div>

                    {/* Cart Section (1 column wide) */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '2rem', borderTop: '4px solid var(--primary-color)' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}><ShoppingBag size={20} /> Current Order</h3>
                            
                            {cart.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                    <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Cart is currently empty</p>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                                        {cart.map((item, idx) => (
                                            <div key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{item.product.name}</strong>
                                                    <span style={{ fontWeight: '500' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                {item.customization && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Size/Opt: {item.customization}</div>}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateQuantity(item.product, item.customization, -1)}><Minus size={12} /></button>
                                                    <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateQuantity(item.product, item.customization, 1)}><Plus size={12} /></button>
                                                    <button className="btn" style={{ color: 'var(--danger-color)', padding: '0.2rem 0.5rem', marginLeft: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} onClick={() => updateQuantity(item.product, item.customization, -item.quantity)}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={isAsap} onChange={(e) => setIsAsap(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }} /> 
                                            Deliver ASAP
                                        </label>
                                        {!isAsap && (
                                            <input type="datetime-local" className="form-control" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={{ marginTop: '0.5rem' }} />
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <input type="text" className="form-control" placeholder="Promo/Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied} />
                                        <button className="btn btn-primary" onClick={applyCoupon} disabled={couponApplied}>Apply</button>
                                    </div>

                                    <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                            <span>Subtotal</span>
                                            <span style={{ color: 'var(--text-dark)', fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
                                        </div>
                                        {couponApplied && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--success-color)' }}>
                                                <span>Discount (VOICECART100)</span>
                                                <span style={{ fontWeight: 'bold' }}>-${discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                            <span>Tax (5%)</span>
                                            <span style={{ color: 'var(--text-dark)', fontWeight: '500' }}>${tax.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            <span style={{ color: 'var(--text-dark)' }}>Total</span>
                                            <span style={{ color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }} onClick={handlePlaceOrder}>
                                        Place Order Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Concern Modal */}
            {showConcernModal && (
                <div className="modal-overlay">
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={20} /> Raise a Concern</h3>
                            <button className="btn" style={{ padding: '0.2rem' }} onClick={() => setShowConcernModal(false)}><X size={20} /></button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Log a complaint or concern for customer {customer.phoneNumber}.</p>
                        
                        <form onSubmit={handleConcernSubmit}>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="Describe the issue here..." 
                                value={concernMsg}
                                onChange={(e) => setConcernMsg(e.target.value)}
                                required
                                style={{ resize: 'none', marginBottom: '1rem' }}
                            ></textarea>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Ticket</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Track Order Modal */}
            {showTrackModal && (
                <div className="modal-overlay">
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={20} /> Track Order</h3>
                            <button className="btn" style={{ padding: '0.2rem' }} onClick={() => setShowTrackModal(false)}><X size={20} /></button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter the Order ID to check its current status.</p>
                        
                        <form onSubmit={handleTrackSubmit}>
                            <input 
                                type="text"
                                className="form-control" 
                                placeholder="e.g., ORD-12345" 
                                value={trackOrderId}
                                onChange={(e) => setTrackOrderId(e.target.value)}
                                required
                                style={{ marginBottom: '1rem' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Check Status</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product, onAdd }) => {
    const [customization, setCustomization] = useState('Regular');

    const hasSizes = product.category === 'Pizza' || product.category === 'Beverages';

    return (
        <div className="card product-card" style={{ transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-dark)' }}>{product.name}</h3>
            <p className="desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
            <div className="price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>${product.price.toFixed(2)}</div>
            
            {hasSizes && (
                <select className="customization-select" value={customization} onChange={(e) => setCustomization(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
                    <option value="Small">Small</option>
                    <option value="Regular">Regular</option>
                    <option value="Large">Large</option>
                </select>
            )}

            <button className="btn btn-outline" style={{ width: '100%', padding: '0.5rem' }} onClick={() => onAdd(product, hasSizes ? customization : null)}>
                Add to Cart
            </button>
        </div>
    );
};

export default OrderPage;
