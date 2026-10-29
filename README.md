# Auth API (Node + Express + MongoDB)

A simple project for user register and login, using:

- bcryptjs: hashing passwords
- jsonwebtoken: JWT token
- cookie-parser: reading cookies
- MongoDB (Mongoose): saving users

## Setup

1. Install Node.js (check with `node -v`).
2. Open this folder in the terminal and run:

   npm install

3. Open the `.env` file and change:

   MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/authDB
   JWT_SECRET=mysecretkey123

   (Use your MongoDB Atlas connection string. Use any long secret for JWT_SECRET.)

4. Start the server:

   npm run dev

You should see:

   MongoDB connected
   Server running on port 5000

## API routes

| Action   | Method | URL                | Body (JSON)                                           |
|----------|--------|--------------------|-------------------------------------------------------|
| Register | POST   | /api/auth/register | {"name":"Arun","email":"arun@gmail.com","password":"123456"} |
| Login    | POST   | /api/auth/login    | {"email":"arun@gmail.com","password":"123456"}        |
| Profile  | GET    | /api/auth/profile  | none (only works after login)                         |
| Logout   | POST   | /api/auth/logout   | none                                                  |

## How to test (Postman or Thunder Client)

1. Register a user.
2. Login. Open the Cookies tab: you will see a cookie called `token`.
3. Call Profile. It works because the cookie is sent automatically.
4. Logout, then call Profile again. You get "Please login" (401).
5. Open MongoDB Atlas, Browse Collections, users. The password is a long hash,
   not the real password.

## How it works

REGISTER
   password -> bcrypt.hash() -> saved in MongoDB as a hash

LOGIN
   email -> find the user
   password -> bcrypt.compare() with the saved hash
   if correct -> jwt.sign() makes a token -> token is put in a cookie

PROTECTED ROUTE (profile)
   browser sends the cookie -> protect middleware -> jwt.verify()
   if the token is good -> the controller runs

## Folders

- server.js: sets up Express, connects to MongoDB, starts the server
- config/db.js: MongoDB connection
- models/User.js: what a user looks like
- controllers/authController.js: register, login, logout, profile logic
- middleware/protect.js: checks the token (runs before protected routes)
- routes/authRoutes.js: connects each URL to a controller function
- .env: secrets (do not upload to GitHub)

## Using it from React

The cookie is only saved and sent if you add `credentials: "include"`:

   fetch("http://localhost:5000/api/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     credentials: "include",
     body: JSON.stringify({ email, password }),
   });

The server already allows this. CLIENT_URL in `.env` must match your React URL
(for example http://localhost:5173).

## Common problems

- Authentication failed / timeout: check MONGO_URI, and add your IP in Atlas Network Access.
- "JWT_SECRET is missing": add JWT_SECRET to the .env file.
- "Please login" after logging in: in Postman cookies are saved automatically;
  in React add credentials: "include".
- req.cookies is undefined: cookieParser() must be before the routes in server.js.
- Changed .env but nothing changed: restart the server.
