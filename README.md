# VoiceCart - BPO Call Center Simulation

VoiceCart is a full-stack web application designed to simulate a BPO system where agents handle customer calls, log issues, and place orders.

## Technologies Used
- **Backend**: Spring Boot, Spring Data JPA, MySQL, Twilio
- **Frontend**: React, Vite, Axios, React Router DOM
- **Database**: MySQL 8.0

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, DBeaver, or command line).
2. Run the `schema.sql` file provided in the root directory:
   ```bash
   mysql -u root -p < schema.sql
   ```
   *Replace `root` with your actual MySQL username if different.*
3. This script will create the `voicecart_db` database, tables, and insert some sample menu items and users.

### 2. Backend Setup (Spring Boot)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Open `src/main/resources/application.properties`.
3. Update the MySQL credentials if they are different from `root`/`root`:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
4. Replace the Twilio placeholders with your actual Twilio Account SID, Auth Token, and Twilio Phone Number.
   ```properties
   twilio.account.sid=YOUR_TWILIO_SID
   twilio.auth.token=YOUR_TWILIO_AUTH_TOKEN
   twilio.phone.number=YOUR_TWILIO_PHONE_NUMBER
   ```
   *(If you leave these as placeholders, the application will simulate SMS by logging to the console instead of throwing errors).*
5. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(If you have Eclipse/IntelliJ, simply import the `backend` folder as a Maven project and run `VoiceCartApplication.java`)*.
   The backend will run on `http://localhost:8080`.

### 3. Frontend Setup (React)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies (already installed if you ran the scaffolding, but good to ensure):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will typically run on `http://localhost:5173`. Open this URL in your browser to access the Agent Dashboard.

### 4. Twilio Webhook Setup (for live incoming calls)
To test the incoming call feature, Twilio needs to reach your local backend.
1. Download and install [ngrok](https://ngrok.com/).
2. Start ngrok on port 8080:
   ```bash
   ngrok http 8080
   ```
3. Copy the `Forwarding` HTTPS URL from the ngrok terminal (e.g., `https://abcdef123.ngrok.app`).
4. Go to your [Twilio Console](https://console.twilio.com/).
5. Navigate to your Phone Numbers -> Manage -> Active Numbers -> Click your number.
6. Scroll down to the **Voice** section. Under "A CALL COMES IN", select "Webhook" and paste your ngrok URL with the incoming call endpoint:
   ```text
   https://abcdef123.ngrok.app/api/calls/incoming
   ```
7. Ensure HTTP POST is selected, and click **Save**.
8. Call your Twilio phone number from a real phone. The backend will receive the webhook, save it to the database with `RINGING` status, and the React frontend will automatically detect the incoming call!

## How to Test the Flow Without Twilio
If you don't have Twilio set up, you can manually trigger an incoming call using Postman or cURL:
```bash
curl -X POST "http://localhost:8080/api/calls/incoming?From=%2B919876543210&CallSid=simulated_call_sid"
```
The React frontend (polling every 3 seconds) will immediately show an incoming call from `+919876543210`.
