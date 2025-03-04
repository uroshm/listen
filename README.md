# Listen

## Backend

The backend is built with Spring Boot and includes the following features:

- User authentication and authorization using JWT.
- RESTful API for managing widgets.
- Integration with PostgreSQL database.

### Running the Backend

To run the backend, use the following commands:

```sh
cd backend
./gradlew bootRun
```

## Frontend

The frontend is built with React and TypeScript and includes the following features:

- User authentication using JWT.
- Components for managing and displaying widgets.
- Integration with the backend API.

### Running the Frontend
To run the frontend, use the following commands:
```sh
cd frontend
npm run dev
```

## Database
The database is managed using PostgreSQL and includes the following features:

### Schema and table creation for widgets.
Initialization script for setting up the database.

## Docker
The project includes Docker support for running the backend, frontend, and database in containers.

### Running with Docker
To run the entire application using Docker, use the following command:
```sh
docker-compose up
```

## License
This project is licensed under the GNU General Public License v3.0. See the LICENSE file for details.