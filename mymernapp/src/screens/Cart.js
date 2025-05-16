import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchCart();
    const navigate = useNavigate();

    if (data.length === 0) {
        return (
            <div className='m-5 w-80 text-center fs-3'>
                The Cart is Empty!
            </div>
        );
    }

    const handleCheckOut = () => {
        navigate('/checkout');
    }

    let totalPrice = data.reduce((total, clothItem) => total + clothItem.price, 0);

    return (
        <div>
            <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                <table className='table table-hover'>
                    <thead className='text-primary fs-4'>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Size</th>
                            <th scope='col'>Total Amount</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((clothItem, index) => (
                            <tr>
                                <th scope='row'>{index + 1}</th>
                                <td>{clothItem.brand}</td>
                                <td>{clothItem.qty}</td>
                                <td>{clothItem.size}</td>
                                <td>{clothItem.price}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn p-0'
                                        onClick={() =>
                                            dispatch({ type: 'REMOVE', id: clothItem._id, index: index })
                                        }
                                    >
                                        <i className="bi bi-trash text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='d-flex justify-content-end'>
                    <h1 className='fs-4'>Total Amount: PKR {totalPrice}</h1>
                </div>
                <div className='d-flex justify-content-center mt-3'>
                    <button className='btn btn-primary' onClick={handleCheckOut}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
}
