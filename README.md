# Preloved - Where Fashion Stories Come to Life

Preloved is a sustainable fashion platform that allows users to browse, buy, and sell pre-owned clothing. It offers an eco-friendly shopping experience with various features to enhance user engagement, such as filtering items by price, adding products to the cart, and viewing previous orders.

## Tech Stack

This project is built using the MERN stack, which includes:

- **MongoDB**: NoSQL database used to store clothing items, categories, and user data.
- **Express**: Backend framework that handles API requests and server-side logic.
- **React**: Frontend library used to build the user interface and manage dynamic content.
- **Node.js**: JavaScript runtime used to build the backend and server.
- **Bootstrap**: For styling the frontend components.
- **JWT (JSON Web Token)**: For user authentication and authorization.
- **Bcrypt.js**: For securely hashing passwords.
  
## Features

### User Authentication
- **Login/Logout**: Users can log in using their credentials (email and password), and their session is maintained with a **JWT token**. The user can log out, which will remove the token and log them out of the platform.
- **JWT Authentication**: The app uses JWT tokens to securely authenticate users, ensuring that only authorized users can access protected routes like adding products to the cart or viewing previous orders.

### Cart & Checkout
- **Add to Cart**: Users can add selected items to their cart and proceed to checkout.
- **Update Cart**: Users can update the quantity of items in their cart or remove them.
- **View Previous Orders**: Users can view their past orders in the 'My Orders' page.

### Product & Category Management
- **Filter by Price**: Sort items by price (Low to High or High to Low) to find the best deals.
- **Category Dropdown**: Users can filter products by category (e.g., clothing, accessories) using a dropdown menu.
- **Search Functionality**: Users can search for products by brand or item name.
- **Product Details**: Each product displays a detailed view, including size options and prices.

### UI Components
- **Header**: The header includes the site navigation, a search bar, and the user authentication options (login/logout).
- **Footer**: The footer contains helpful links, contact information, and additional site navigation.

### About Page
- Provides an overview of the Preloved platform, its mission, and the benefits of shopping sustainably.

## Functionalities

### Home Page
- Displays a carousel of featured products and categories.
- Users can filter products by price using the "Sort by Price" dropdown menu and search for items by keywords.
- Displays product cards for each item, where users can view more details and add items to their cart.

### About Page
- A dedicated page that provides information about the platform, its mission, and the community-driven values of sustainability.

### Authentication
- **Login**: Users can log in by providing their credentials (email and password).
- **JWT Token Authentication**: Once logged in, a JWT token is generated and stored to authorize future requests.
- **Logout**: The user can log out and the session will be cleared, invalidating the JWT token.

### Cart & Checkout

- **Add to Cart:** Users can add selected items to their cart and proceed to checkout.
- **Update Cart:** Users can update the quantity of items in their cart or remove them.
- **View Previous Orders:** Users can view their past orders in the 'My Orders' page.
- **Cash on Delivery (COD):** After completing the checkout, users can choose Cash on Delivery (COD) as their payment method. Upon selecting COD, a prompt message is displayed, asking the user to enter their shipping details (such as name, address, and phone number). The total order amount is displayed along with these details before the user confirms the order for fulfillment.

### My Orders
- Users can view their past orders and order details on the "My Orders" page.

### Category Selection & Sorting
- Users can filter clothing items by category.
- Products are also sorted by price (Low to High, High to Low).

### Recommendations
Personalized product suggestions based on user preferences and behavior.

- **Content-Based Filtering**: Analyzes the user's previous orders to recommend items based on preferred categories, brands, and price range.
- **Collaborative Filtering**: Identifies users with similar purchase histories and recommends items they have bought but the current user has not.
- Recommendations are stored and updated in the database for faster access and improved accuracy.
