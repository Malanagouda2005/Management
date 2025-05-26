# Backend API for Patient Management System

This project is a backend API for a Patient Management System built using TypeScript and Express. It provides endpoints for user authentication and patient management.

## Project Structure

- **src/**: Contains the source code for the application.
  - **controllers/**: Contains the logic for handling requests and responses.
    - `authController.ts`: Handles user authentication (login, registration).
    - `patientController.ts`: Manages patient-related operations (CRUD).
  - **models/**: Defines the data structure and interacts with the database.
    - `patientModel.ts`: Defines the Patient model.
  - **routes/**: Sets up the API routes.
    - `authRoutes.ts`: Defines routes for authentication.
    - `patientRoutes.ts`: Defines routes for patient management.
  - **middlewares/**: Contains middleware functions for request processing.
    - `authMiddleware.ts`: Handles authentication checks.
  - **services/**: Contains business logic for the application.
    - `patientService.ts`: Manages patient data and interactions.
  - **utils/**: Contains utility functions.
    - `db.ts`: Manages database connections and operations.
  - **types/**: Contains TypeScript types and interfaces.
    - `index.ts`: Defines types used throughout the application.
  - `app.ts`: The entry point of the application.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To start the application, run:
```
npm start
```

The server will start on the specified port (default is 3000).

## API Endpoints

- **Authentication**
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.

- **Patients**
  - `GET /api/patients`: Retrieve a list of patients.
  - `POST /api/patients`: Add a new patient.
  - `PUT /api/patients/:id`: Update patient details.
  - `DELETE /api/patients/:id`: Delete a patient.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.