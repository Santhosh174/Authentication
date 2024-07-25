# Email OTP Authentication System

## Overview

This project implements an Email OTP (One-Time Password) Authentication System to enhance security by sending a one-time password to users' email addresses for verification during login or registration. Built using Node.js, Express.js, MongoDB, and Nodemailer, this system provides a secure and user-friendly way to authenticate users.

## Features

- Email OTP generation and delivery
- Secure OTP validation
- Resend OTP functionality
- User-friendly interface
- Expiration handling for OTPs
- Responsive design for various devices

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Email Service:** Nodemailer
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT (JSON Web Tokens)

## Installation

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/Santhosh174/Email-OTP-Authentication.git
    cd Email-OTP-Authentication
    ```

2. **Install Dependencies:**
    ```sh
    npm install
    ```

3. **Configure Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    EMAIL_SERVICE=your_email_service_provider
    EMAIL_USER=your_email_address
    EMAIL_PASS=your_email_password
    JWT_SECRET=your_jwt_secret_key
    ```

4. **Start the Server:**
    ```sh
    npm start
    ```

5. **Access the Application:**
    Open your browser and navigate to `http://localhost:5000`

## Usage

1. **User Registration/Login:**
    - Users enter their email to request an OTP.
    - The system generates and sends an OTP to the user's email.

2. **OTP Verification:**
    - Users enter the received OTP.
    - The system validates the OTP and grants access upon successful verification.

3. **Resend OTP:**
    - Users can request to resend the OTP if they did not receive the original one or if it expired.

## Screenshots

![image](https://github.com/user-attachments/assets/72bd9c85-d719-484f-ad56-b0d340fd3088)
*Description: Screenshot of the signup page where users enter their email to receive an OTP.*

![image](https://github.com/user-attachments/assets/a6227786-a5da-44fd-8b96-e96f1138b6fd)
*Description: Screenshot of the OTP verification page where users enter the received OTP.*

![image](https://github.com/user-attachments/assets/6080e6da-f988-412b-8af4-aa028743d221)
*Description: Screenshot showing the email received by the user containing the OTP for verification.*

![image](https://github.com/user-attachments/assets/8d346f84-569c-4bc2-83f1-60b676895385)
*Description: Screenshot showing the landing page of this website.*

![image](https://github.com/user-attachments/assets/b2c2a14d-0101-481d-9263-adc88641ac02)
*Description: Screenshot showing the user profile of this website after logged in successfully.*

## Contact

For questions or inquiries, please contact:
- **Name:** Santhosh
- **Email:** santhoshcse18@gmail.com
