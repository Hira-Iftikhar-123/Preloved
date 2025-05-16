import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <h5 className="text-uppercase fw-bold mb-4">Preloved</h5>
            <p className="text-muted">
              Your destination for quality pre-owned fashion. We believe in sustainable shopping and helping you find unique pieces that tell your story.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href=" https://www.facebook.com/share/cc8kGb18J3LUrXpb/?" className="text-light">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://www.instagram.com/pre.is.reloved?" className="text-light">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href=" https://youtube.com/@prelovedisreloved-h4t?" className="text-light">
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-4 ms-auto">
            <h6 className="text-uppercase fw-bold mb-2">Newsletter</h6>
            <p className="text-muted mb-3">Subscribe to receive updates on new arrivals and special offers.</p>
            <form>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                  aria-label="Your email address"
                />
                <button className="btn btn-primary" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

        </div>
        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">© 2025 Preloved. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link>
              </li>
              <li className="list-inline-item">
                <span className="text-muted">•</span>
              </li>
              <li className="list-inline-item">
                <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
