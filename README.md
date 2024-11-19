Here’s a detailed `README.md` for your project:

---

# Jalan Company Secure Login Portal

This project is a **Secure Login Portal**, featuring a custom OTP-based authentication system integrated with fraud detection. The frontend is built with React, and the backend is powered by Express.js and OpenAI's ChatGPT for fraud detection analysis.

## **Features**
1. **Custom Login Flow**:
   - Enter phone number and request OTP.
   - Verify OTP and securely log in.

2. **Fraud Detection**:
   - Analyzes user activity data like typing speed, mouse movements, and button click positions.
   - Determines if the interaction is genuine or fraudulent using OpenAI's ChatGPT.

3. **Device Information**:
   - Captures user device and browser information to enhance fraud detection.

## **Technologies Used**
### **Frontend**
- **React** (with Material-UI for styling)
- **Axios** for API calls
- JavaScript ES6+

### **Backend**
- **Node.js** (with Express.js)
- **OpenAI API** (ChatGPT integration)
- **Sequelize** for database interactions
- **PostgreSQL** as the database

### **Database**
- **PostgreSQL**:
  - Stores user details and logs activity data.

## **Setup Instructions**

### **Prerequisites**
1. Node.js (v14+)
2. PostgreSQL database
3. OpenAI API key
4. Git

---

### **Backend Setup**
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with:
   ```plaintext
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run database migrations (if applicable):
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. Backend runs on: `http://localhost:5010`

---

### **Frontend Setup**
1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5010
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

5. Frontend runs on: `http://localhost:3000`

---

### **Project Directory Structure**

```plaintext
root/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── fraudRoutes.js
│   │   ├── models/
│   │   ├── app.js
│   │   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── .gitignore
│   ├── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthComponents.js
│   │   │   ├── Navbar.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── .env
│   ├── package.json
│   ├── .gitignore
│   ├── README.md
```

---

## **Usage**

1. Navigate to `http://localhost:3000` to use the login portal.
2. Enter your phone number and request an OTP.
3. Enter the OTP to log in.
4. The backend will analyze user activity data and determine if the interaction is genuine or fraudulent.

---

## **Fraud Detection**
### **Parameters Analyzed**
1. **Typing Speed**:
   - Time to enter the phone number.
2. **Mouse Movements**:
   - Number of mouse movements during the session.
3. **Button Click Positions**:
   - X, Y coordinates of button clicks.
4. **Device Information**:
   - User agent, platform, and screen resolution.

### **Rules for Classification**
- If any metric is suspicious (e.g., too fast typing speed, low mouse movement, etc.), the system flags the interaction as "Fake."

---

## **API Endpoints**

### **Backend API**
1. **Request OTP**:
   - `POST /api/request-otp`
   - Body: `{ phoneNumber }`

2. **Verify OTP**:
   - `POST /api/verify-otp`
   - Body: `{ phoneNumber, otp }`

3. **Fraud Detection**:
   - `POST /fraud/fraud-check`
   - Body: `activityData`

---

## **Environment Variables**
### **Frontend**
- `REACT_APP_API_URL`: Backend API base URL.

### **Backend**
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT generation.
- `OPENAI_API_KEY`: API key for OpenAI.

---

## **Contributing**
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a pull request.

---

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.
