# Bite Cafe - A Restaurant Web Application  

## Description
Bite Cafe is a MERN (MongoDB, Express.js, React.js, Node.js) stack project designed to  manage & promote restaurant business. It provides a platform for administrators & users to efficiently deal & consume services of a restaurant. There are some features like reservation management, menu & items management, order management, and secure payment methods, Bite Cafe aims to be a comprehensive solution for managing & give best service for user in online restaurant platforms.

## Source Code:
## [ Client Side Code](https://github.com/sahosskhan/bite-cafe-client-side)

## [ Server Side Code](https://github.com/sahosskhan/bite-cafe-server-side)

## Preview: 
## [ Client Side Preview](https://bite-cafe.web.app)

## [ Server Side Preview](https://bite-cafe-server-side.vercel.app)

 # Admin Dashboard:
## Email: sahossadmin@bitecafe.com
## Password: Sahoss@123

# User Dashboard:
## Email: sangramuser@bitecafe.com
## Password: Sahoss@123


# Features

## Admin Dashboard

### Admin Home
- Admin can see highlight of site content like how many total orders, total menus, total bookings, total revenue, customer.
- Admin can see statistics of each category's item quantity from total order.
- Admin can see statistics of category ratio from total revenue.

### Manage User
- Admin can change user role.
- Admin can terminate or remove any user.

### Mange Items
- Admin can edit any item details in any time.
- Admin can delete any item in any time.

### Add Items
- Admin can add any items in menu.
- Admin can browse his local device for upload items image by imgbb.

### Manage Booking
- Admin can see booking user details.
- Admin can done 2 action to user booking approve & reject.
- Once admin reject any booking can't approve & once approve any booking can't reject.



## User Dashboard

### User Home
- User see his profile card.
- User can track his activity highlight like how many order, bookings, payments, reviews he completed.

### Reservation
- User can reserve or book a table according his choice from here.

### Payment HISTORY
- User can see his ordered items and paid history for his all order.

### My Cart
- User can see which items he add to cart for order.
- User can delete added item from cart. 
- User can proceed to pay for his added item as order confirm.

### Add Review
- User can share feelings as review and rate our service from here.

### My Bookings
- User can see his booking status from here.
- User can cancel his booking.
- User can re book his booking if admin rejects his booking.



## Payment Method
- Stripe payment method available for secure transactions.

## Database Operations
- MongoDB CRUD operations & aggregate operations for efficient data management.

## User Authentication
- Firebase for secure user custom authentication & user social authentication  .

## Authorization
- JWT ( JSON WEB TOKEN ) for secure, authorize & valid user access in site as authorization

## Technology Used

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework packed with classes.
- **Axios**: Promise-based HTTP client for making AJAX requests.
- **TanStack Query**: Powerful asynchronous state management & handling API requests, pending and error states, and more. 
- **Sweet Alert 2**: A beautiful, responsive, customizable and accessible (WAI-ARIA) replacement for JavaScript's popup boxes.
- **Swiper JS**: Swiper is the most modern free mobile touch slider with hardware accelerated transitions and amazing native behavior.
- **DaisyUI**: Its adds a set of customizable color names to Tailwind CSS and these new colors use CSS variables for the values.
- **Recharts**: A composable charting library built on React components.


- **React Hook From**: A react-based performant, flexible and extensible form with easy-to-use validation.
- **React Router DOM**: Declarative routing for React applications.
-**React Rating**: Zero-dependency, highly customizable rating component for React.
-**React Stripe JS**:  React Stripe.js is a thin wrapper around Stripe Elements. It allows you to add Elements to any React app.
-**React Icons**: popular icon packs using ES6 imports.
-**React Loader Spinner**:react-spinner-loader provides simple React SVG spinner component which can be implemented for async await operation before data loads to the view.
-**React Parallax**: A React Component for parallax effect working in client-side and server-side rendering environment. 
-**React Responsive Carousel**:  Powerful, lightweight and fully customizable carousel component for React apps.
-**React Tab**: An accessible and easy tab component for ReactJS.
-**React Simple-captcha**: A very simple, powerful and highly customizable captcha for ReactJS.


### Backend
- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: Fast, un-opinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.

### Authentication
- **Firebase Authentication**: A service that provides backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users to your app.
- **JSON Web Tokens (JWT)**: Compact, URL-safe means of representing claims to be transferred between two parties.

### Payment Processing
- **Stripe**: A technology company that builds economic infrastructure for the internet.

### Other Tools
- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env.
- **npm**: A package manager for Node.js packages.
- **CORS**: Its is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options



## Project Setup Or Run On Your Local Machine
1. Clone the repository:
    ```
    git clone https://github.com/sahosskhan/bite-cafe-client-side.git (client)
     git clone https://github.com/sahosskhan/bite-cafe-server-side.git (server)
    ```
2. Navigate to the project directory:
    ```
    cd bite-cafe-client-side (client)
    cd bite-cafe-server-side (server)
    ```
3. Install all dependencies:
    ```
    npm install
    ```
4. Set up environment variables:
    - Create a `.env.local`(client) or `.env`(server) file in the root directory.
    - Define the all env variables according to you.
5. Start the server:
    ```
    npm run dev (client)
    nodemon (server)
    ```
6. Navigate to `http://localhost:5173/` (client) `http://localhost:5000` (server) in your browser to view the application.

## Contributors
- [sahosskhan](https://github.com/sahosskhan)

## License
This project is licensed under the [MIT License](https://github.com/sahosskhan).

## Acknowledgements
- This project was inspired by the need for a comprehensive gaming contest management platform.
- Special thanks to the creators of MongoDB, Express.js, React.js, and Node.js for their incredible frameworks.
- Thanks to Firebase for providing secure authentication services.
- Thanks to Stripe for their secure payment processing solution.

## Support
For any inquiries or issues, please contact [sahosskhan359@email.com](mailto:sahosskhan359@email.com).







