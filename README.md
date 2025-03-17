# Backend

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/backend.git
```
2. Navigate to the project directory:
```
cd backend
```
3. Install the dependencies:
```
npm install
```

## Usage

To start the development server:
```
npm run dev
```

To start the production server:
```
npm start
```

## API

The backend API provides the following endpoints:

- `POST /login`: Authenticate a user and return a JWT token.
- `POST /register`: Create a new user account.
- `GET /users`: Retrieve a list of all users (requires admin authorization).
- `GET /products`: Retrieve a list of all products.
- `POST /products`: Create a new product (requires admin authorization).
- `PUT /products/:id`: Update an existing product (requires admin authorization).
- `DELETE /products/:id`: Delete a product (requires admin authorization).

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Testing

To run the tests:
```
npm test
```

# Admin

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/admin.git
```
2. Navigate to the project directory:
```
cd admin
```
3. Install the dependencies:
```
npm install
```

## Usage

To start the development server:
```
npm run dev
```

To build the production version:
```
npm run build
```

To preview the production build:
```
npm run preview
```

## API

The admin application interacts with the backend API to perform administrative tasks, such as managing users and products.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Testing

To run the linter:
```
npm run lint
```

# Frontend

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/frontend.git
```
2. Navigate to the project directory:
```
cd frontend
```
3. Install the dependencies:
```
npm install
```

## Usage

To start the development server:
```
npm run dev
```

To build the production version:
```
npm run build
```

To preview the production build:
```
npm run preview
```

## API

The frontend application interacts with the backend API to display and manage data, such as products and user information.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Testing

To run the linter:
```
npm run lint
```
