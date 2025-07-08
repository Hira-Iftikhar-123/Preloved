import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DressForm = ({ dress, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        category: '',
        sizes: {
            small: '',
            medium: '',
            large: ''
        },
        isAvailable: true
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (dress) {
            setFormData({
                name: dress.name,
                brand: dress.brand,
                description: dress.description,
                category: dress.category,
                sizes: dress.sizes,
                isAvailable: dress.isAvailable
            });
            setPreviewImages(dress.images);
        }
    }, [dress]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('size_')) {
            const size = name.split('_')[1];
            setFormData(prev => ({
                ...prev,
                sizes: {
                    ...prev.sizes,
                    [size]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        if (index < images.length) {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('sizes', JSON.stringify(formData.sizes));
            formDataToSend.append('isAvailable', formData.isAvailable);
            images.forEach(image => {
                formDataToSend.append('images', image);
            });
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            };
            if (dress) {
                await axios.put(`/api/admin/dresses/${dress._id}`, formDataToSend, { headers });
            } else {
                await axios.post('/api/admin/dresses', formDataToSend, { headers });
            }
            onSave();
        } catch (error) {
            setError(error.response?.data?.error || 'Error saving dress');
        }
    };

    return (
        <div className="admin-card" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="dressform-title">{dress ? 'Edit Dress' : 'Add New Dress'}</h2>
                <button
                    className="btn-close btn-close-white dressform-close-btn"
                    style={{ fontSize: '1.5rem', background: 'none', border: 'none', boxShadow: 'none' }}
                    onClick={onClose}
                    aria-label="Close"
                />
            </div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="brand" className="form-label">Brand</label>
                        <input
                            type="text"
                            className="form-control"
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            className="form-control"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Casual Wear">Casual Wear</option>
                            <option value="Wedding dresses">Wedding dresses</option>
                            <option value="2 piece dresses">2 piece dresses</option>
                            <option value="3 piece dresses">3 piece dresses</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="isAvailable" className="form-label mb-0">Available for Sale</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="size_small" className="form-label">Small Price</label>
                        <input
                            type="text"
                            className="form-control"
                            id="size_small"
                            name="size_small"
                            value={formData.sizes.small}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="size_medium" className="form-label">Medium Price</label>
                        <input
                            type="text"
                            className="form-control"
                            id="size_medium"
                            name="size_medium"
                            value={formData.sizes.medium}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="size_large" className="form-label">Large Price</label>
                        <input
                            type="text"
                            className="form-control"
                            id="size_large"
                            name="size_large"
                            value={formData.sizes.large}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Images</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required={!dress}
                    />
                    <div className="mt-3">
                        <div className="row g-3">
                            {previewImages.map((preview, index) => (
                                <div key={index} className="col-md-3 position-relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="img-thumbnail bg-dark border-secondary"
                                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                                        onClick={() => removeImage(index)}
                                        style={{ width: '24px', height: '24px', padding: '0' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-secondary rounded-pill px-4"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-4"
                    >
                        {dress ? 'Update Dress' : 'Add Dress'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DressForm; 