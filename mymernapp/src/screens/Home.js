import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Home() {
  const [categories, setclothcat] = useState([]);
  const [items, setclothitems] = useState([]);
  const [search, setSearch] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();
  const selectedCategory = location.state?.selectedCategory || null;
  const [dresses, setDresses] = useState([]);

  const loadData = async () => {
    try {
              let response = await fetch('/api/data?action=getDresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      response = await response.json();

      setclothitems(response[0]);
      setclothcat(response[1]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    loadData();
    // Fetch all dresses for users
    axios.get('/api/dresses')
      .then(res => setDresses(res.data))
      .catch(err => console.error(err));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div>
      <Header />
      <div><div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={process.env.PUBLIC_URL + '/priscilla-du-preez-dlxLGIy-2VU-unsplash.jpg'}
              className="d-block w-100"
              alt="Fashion Collection"
              style={{
                height: '600px',
                objectFit: 'cover',
                filter: 'brightness(0.8)'
              }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100" style={{ color: 'black' }}>
              <h1 className="display-4 fw-bold mb-4">Discover Your Style</h1>
              <p className="lead mb-5">Find unique preloved fashion pieces that tell your story</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={process.env.PUBLIC_URL + '/artem-beliaikin-dwZjyFGWR2g-unsp.jpg'}
              className="d-block w-100"
              alt="Fashion Collection"
              style={{
                height: '600px',
                objectFit: 'cover',
                filter: 'brightness(1.0)'
              }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100" style={{ color: 'black' }}>
              <h1 className="display-4 fw-bold mb-4">
                Sustainable Fashion
              </h1>
              <p className="lead mb-5">
                Shop preloved items and make a difference
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={process.env.PUBLIC_URL + "/artem-beliaikin-pJPGCvLblGk-unsplash.jpg"}
              className="d-block w-100"
              alt="Fashion Collection"
              style={{
                height: '600px',
                objectFit: 'cover',
                filter: 'brightness(0.8)'
              }}
            />
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100" style={{ color: 'black' }}>
              <h1 className="display-4 fw-bold mb-4">Quality Pre-owned Items</h1>
              <p className="lead mb-5">Curated collections of premium fashion pieces</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div></div>

      {/* SEARCH BAR ALWAYS VISIBLE */}
      <div className="search-container w-75 mx-auto" style={{ marginTop: '-150px', zIndex: 2, position: 'relative' }}>
        <div className="d-flex gap-3 justify-content-center">
          <div className="input-group input-group-lg w-75 mx-auto">
            <input
              type="search"
              className="form-control"
              placeholder="Search for dresses, accessories, and more..."
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="btn btn-primary btn-lg px-4">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '150px' }}> 
        <div className="row mb-4">
        <div className="col-12 col-md-4 ms-auto">
        <div className="input-group">
  <select
    id="sortPrice"
    className="form-select w-auto"
    value={sortOrder}
    onChange={e => setSortOrder(e.target.value)}>
    <option value="">Default</option>
    <option value="lowToHigh">Low to High</option>
    <option value="highToLow">High to Low</option>
  </select>
  <label className="btn btn-primary input-group-text fw-semibold" htmlFor="sortPrice" > 
    Sort by Price
  </label>
</div>
          </div>
        </div>
        {categories.length > 0 ? (
          categories
            .filter(category => !selectedCategory || category.CategoryName === selectedCategory)
            .map((category) => (
              <div className='row mb-3' key={category._id}>
                <div className='fs-3 m-3'>{category.CategoryName}</div>
                <hr />

                <div className="row g-4">
                  {(() => {
                    // Filter items from ClothingData for this category
                    let filteredItems = items.filter(item => item.categoryname?.trim().toLocaleLowerCase() === category.CategoryName?.trim().toLocaleLowerCase() && (item.brand.toLowerCase().includes(String(search).toLocaleLowerCase())));
                    // Filter dresses from admin for this category
                    let filteredDresses = dresses.filter(dress => dress.category?.trim().toLocaleLowerCase() === category.CategoryName?.trim().toLocaleLowerCase() && (dress.brand.toLowerCase().includes(String(search).toLocaleLowerCase())));
                    // Merge both arrays
                    let allItems = [
                      ...filteredItems.map(item => ({ ...item, _isDress: false })),
                      ...filteredDresses.map(dress => ({ ...dress, _isDress: true }))
                    ];

                    if (sortOrder === "lowToHigh") {
                      allItems.sort((a, b) => {
                        const aPrice = Math.min(...Object.values(a.sizes).map(Number));
                        const bPrice = Math.min(...Object.values(b.sizes).map(Number));
                        return aPrice - bPrice;
                      });
                    } else if (sortOrder === "highToLow") {
                      allItems.sort((a, b) => {
                        const aPrice = Math.min(...Object.values(a.sizes).map(Number));
                        const bPrice = Math.min(...Object.values(b.sizes).map(Number));
                        return bPrice - aPrice;
                      });
                    }

                    return allItems.length > 0 ? (
                      <div style={{ margin: '0 -8px' }}>
                        <Slider {...sliderSettings}>
                          {allItems.map(item => (
                            <div key={item._id} style={{ padding: '0 8px', height: '100%' }}>
                              <Card
                                clothItem={item}
                                imageSrc={
                                  item._isDress
                                    ? (item.images && item.images.length > 0
                                        ? (item.images[0].startsWith('/uploads')
                                            ? item.images[0]
                                            : '/uploads/dresses/' + item.images[0])
                                        : null)
                                    : item.img
                                }
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    ) : <div>No Items Found</div>;
                  })()}
                </div>
              </div>
            ))
        ) : (
          <div className='text-center py-5'>Loading Categories!</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
