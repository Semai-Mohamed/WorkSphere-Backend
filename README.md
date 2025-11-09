
# WorkSpher

**Version:** 0.0.1  

<p>WorkSpher is a freelance platform developed as a project for the "Conduit de Projet (CDP)" module in 2CS. It serves as a practical application of project management and software development concepts.</p>

---

## Table of Contents
- [Project Structure](#project-structure)
-  [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
 - [API Documentation](#api-documentation)
- [Linting & Formatting](#linting--formatting)
- [Features](#features)
- [Security & Validation](#security--validation)
- [License](#license)











## Project Structure
````
src/  
├── auth  
├── casl  
├── common  
│ ├── strategies  
│ │ ├── redis  
│ │ └── token  
├── conversation  
│ └── entity  
├── dto  
├── filters  
├── notification  
├── offer  
├── payment  
├── pipes  
├── portfolio  
├── project  
└── user  
└── strategies.service
````



## Technologies

- **Backend:** NestJS, TypeScript, Node.js
- **Database:** PostgreSQL, TypeORM
- **WebSocket:** Socket.IO, Redis Adapter
- **Auth & Security:** Passport, JWT, CASL,REDIS
- **Payment & Cloud:** Stripe, Cloudinary
- **Linting & Formatting:** ESLint, Prettier

---

## Installation

**1. Clone the repository** 

```bash
git clone https://github.com/Semai-Mohamed/WorkSpher.git
cd WorkSpher
````

**2. Install dependencies**:

````bash
npm install
````


## Environment Variables

| Variable                          | Description                                                                                       |
|----------------------------------|---------------------------------------------------------------------------------------------------|
| `JWT_SECRET`                      | Secret key used to sign and verify JWT tokens for authentication.                                  |
| `GOOGLE_CLIENT_ID`                | Client ID for Google OAuth authentication, used to identify the app to Google.                    |
| `GOOGLE_CLIENT_SECRET`            | Secret key for Google OAuth, used to authenticate the app with Google.                            |
| `APP_PASSWORD`                     | Application password used for internal operations or authentication processes.                     |
| `URI_REDIRECTION`                 | Redirect URL for OAuth callback after Google login (`http://localhost:3000/auth/google/callback`).|
| `EMAIL`                            | Email address used for sending notifications or system emails .      |
| `HOST`                             | SMTP server host for sending emails (`smtp.gmail.com`).                                           |
| `BackendHost`                      | Base URL of the backend server (`http://localhost:3000/`).                                         |
| `FrontendHost`                     | Base URL of the frontend application (`http://localhost:3001/`).                                   |
| `CLOUDINARY_NAME`                  | Cloudinary cloud name for storing and managing media assets .                         |
| `CLOUDINARY_KEY`                   | API key for accessing Cloudinary services (`6...`).                                     |
| `CLOUDINARY_SECRET`                | API secret for Cloudinary authentication .                          |
| `CLOUDINARY_ENVIRONMENT_VARIABLE`  | Full Cloudinary environment variable for SDK configuration (`cloudinary://...`).       |
| `STRIPE_SECRET_KEY`                | Secret key for Stripe, used for server-side payment processing.                                   |
| `STRIPE_PUBLIC_KEY`                | Public key for Stripe, used on the frontend for secure payment forms.                              |
| `STRIPE_WEBHOOK_SECRET`            | Secret key to verify Stripe webhook events and ensure authenticity.                               |

## Running the Project

| Environment    | Command                           | Description                                      |
|----------------|-----------------------------------|--------------------------------------------------|
| Development    | `npm run start:dev`               | Start the project in development mode with watch |
| Production     | `npm run build`                   | Build the project for production                 |
| Production     | `npm run start`                   | Start the built project in production mode       |

## API Documentation

### REST API (Swagger)
- **Title:** WorkSpher
- **Description:** API for the Workspher application
- **Version:** 1.0
- **Endpoint:** `/api`
- **Usage:** [http://localhost:3000/api](http://localhost:3000/api)

### WebSocket API (AsyncAPI)
- **Title:** WebSocket API
- **Description:** Notification & Conversation WebSocket APIs
- **Version:** 1.0
- **Servers:**
  - `ws://localhost:60/notification` – Notification events
  - `ws://localhost:80/conversation` – Conversation events
- **Endpoint:** `/asyncapi`
- **Usage:** [http://localhost:3000/asyncapi](http://localhost:3000/asyncapi)



## Linting & Formatting

| Task                 | Command           | Description                              |
|---------------------|-----------------|------------------------------------------|
| Linting             | `npm run lint`   | Check and fix code style issues using ESLint |
| Formatting          | `npm run format` | Format all files in the project using Prettier |

## Features

### Authentication
- **Google OAuth2 login** with callback and user creation if new.
- **Local authentication** with email/password.
- **Password recovery** and **reset via email** using Nodemailer.
- **JWT-based authentication** with refresh tokens and logout functionality.
- **Role-based access control** using CASL (admin, client, freelancer).
- **Session management** and Redis caching for active sessions and tokens.

### Users
- **Profile management**: view and update user information.
- **Clients**:
  - Can create offers and manage them.
  - Accept freelancers for offers and communicate via real-time chat.
  - Handle payments for offers using Stripe.
- **Freelancers**:
  - Apply to offers and submit proposals.
  - Create, update, and manage projects.
  - Participate in conversations related to offers.
- **Admin**:
  - Monitor platform activity.
  - Handle disputes, fraudulent actions, or conflicts.
  - Dedicated dashboard for managing offers, users, and Stripe payments.

### Offers & Projects
- **Offer management**: create, update, delete, enroll users, approve finished offers.
- **Stripe integration**: secure payment processing and account management for offers.
- **Project management**:
  - Create, update, delete projects.
  - Link projects to freelancers and offers.
  - Track participation and status of projects.

### Conversations & Notifications
- **Real-time conversation system** between clients and freelancers.
- **Notification system**:
  - Fetch all notifications or only unchecked ones.
  - Delete notifications after reading.
- **WebSocket integration** using Socket.IO for real-time updates.
- **Redis adapter** for scaling WebSocket connections and caching messages.

### Portfolio
- Freelancers can **create and manage portfolios**.
- Update and retrieve portfolio details.
- Link portfolios to projects and offers for client visibility.


## Security & Validation
#### 1. Rate Limiting
- Implemented globally using **NestJS ThrottlerModule**, ensuring that repeated requests from the same IP or user are restricted.

#### 2. Password Encryption
- User passwords are securely stored using **bcrypt**, a hashing algorithm that makes it extremely hard for attackers to retrieve the original passwords.

#### 3. Security Headers 
- Helps prevent well-known web vulnerabilities like **XSS, clickjacking, and MIME sniffing**.
- Protects the app from **Cross-Site Request Forgery** attacks.

#### 4. Validation
- Uses **NestJS Pipes** and **class-validator** to validate incoming data.
- Ensures consistent data formats across controllers and services.

#### 5. Role-Based Access Control (CASL)
- Implements **fine-grained permissions** for users
- Protects resources by restricting unauthorized operations at the service or controller level.

## License

This project is licensed under the **MIT License**.  
