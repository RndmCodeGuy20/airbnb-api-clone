# Airbnb API Clone

## Overview

This project aims to replicate the functionality of Airbnb's API, providing a platform for users to list, search, book accommodations, and manage their bookings. It offers secure user authentication, real-time messaging, payment processing, and comprehensive listing management.

## Features

- User registration and authentication with JWT tokens
- Email verification and password reset functionality
- Listing creation, editing, and deletion for hosts
- Advanced search and filtering options for users
- Real-time messaging system between hosts and guests
- Secure payment processing using industry-standard gateways
- Review and rating system for listings and users
- Role-based access control for user management
- Comprehensive documentation for API endpoints
- Error logging and monitoring for troubleshooting

## Technologies Used

- Node.js for backend server implementation
- Express.js for routing and middleware
- MongoDB for data storage
- JWT for secure authentication
- Socket.IO for real-time messaging
- Stripe for payment processing
- Mongoose for MongoDB object modeling
- Nodemailer for email verification and password reset
- Winston for logging

## Setup Instructions

1. Clone the repository: `git clone https://github.com/RndmCodeGuy20/airbnb-api-clone.git`
2. Install dependencies: `npm install`
3. Configure environment variables (e.g., database connection, JWT secret) by creating a `.env.local` file in the root directory and add the keys from `.env.example` with their respective values.
4. Run the server: `npm start`

## API Documentation

The detailed API documentation can be found in the [API Documentation](./docs/api.md) file.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) when submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
