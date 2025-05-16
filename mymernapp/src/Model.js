import React from 'react';
import ReactDOM from 'react-dom';

const MODAL_STYLES = {
    position: 'fixed',
    top: '55%',
    left: '50%',
    backgroundColor: '#2c2c2c',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    height: '70%',
    width: '80%',
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
}

export default function Modal({children,onClose}) {

    return ReactDOM.createPortal(
    <>
    <div style={OVERLAY_STYLES} />
    <div style={MODAL_STYLES}>
        <button className='btn btn-danger fs-4' style={{marginLeft: '95%',marginTop:'-35px'}} onClick={onClose}>X</button>
        {children}
    </div>
    </>
    ,document.getElementById('cart-root')
    )
}
