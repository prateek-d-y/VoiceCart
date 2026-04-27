import React, { useState, useEffect } from 'react';
import { getProducts, placeOrder } from '../services/api';

const MenuModal = ({ onClose, customer, activeCall, setOrderSuccess }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load products", err);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product, quantity) => {
        if (quantity <= 0) return;
        
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                customerId: customer.id,
                agentId: 1, // Assume default agent ID is 1 for now
                callId: activeCall ? activeCall.id : null,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };
            const res = await placeOrder(payload);
            setOrderSuccess(res.data.orderNumber);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to place order.");
        }
        setLoading(false);
    };

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Take Order for {customer.name}</h2>
                    <button className="btn" onClick={onClose}>Close</button>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                    <div className="products-grid">
                        <div className="grid grid-cols-2">
                            {products.map(p => (
                                <div key={p.id} className="card product-card" style={{ marginBottom: 0 }}>
                                    <h3>{p.name}</h3>
                                    <p className="price">${p.price.toFixed(2)}</p>
                                    <ProductAdder onAdd={(qty) => addToCart(p, qty)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-sidebar card">
                        <h3>Cart Summary</h3>
                        {cart.length === 0 ? <p>Cart is empty</p> : (
                            <div>
                                {cart.map(item => (
                                    <div key={item.product.id} className="cart-item">
                                        <div>
                                            <strong>{item.product.name}</strong> x{item.quantity}
                                        </div>
                                        <div>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                            <button 
                                                className="btn btn-danger" 
                                                style={{ padding: '0.1rem 0.4rem', marginLeft: '10px', fontSize: '0.8rem' }}
                                                onClick={() => removeFromCart(item.product.id)}
                                            >X</button>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <strong style={{ fontSize: '1.2rem' }}>Total: ${total.toFixed(2)}</strong>
                                </div>
                                <button 
                                    className="btn btn-success" 
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    onClick={handlePlaceOrder}
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading ? "Placing..." : "Place Order"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductAdder = ({ onAdd }) => {
    const [qty, setQty] = useState(1);
    return (
        <div>
            <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn btn-primary" onClick={() => { onAdd(qty); setQty(1); }}>Add</button>
        </div>
    );
};

export default MenuModal;
