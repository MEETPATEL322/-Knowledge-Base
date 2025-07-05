Backend Setup (Node.js)
Install Dependencies:

npm install
Create .env File:
Add the following environment variables:

PORT=
MONGO_URI=
ADMIN_PASSWORD=
ADMIN_EMAIL=
JWT_SECRET=
JWT_EXPIRES_IN=
GROK_KEY=

Add Admin User:
npm run addAdmin

Start the Server:
npm run dev


Frontend Setup (React)
Install Dependencies:
npm install
Create .env File:
Add the following variable:

REACT_APP_API_URL=http://localhost:<backend-port>

Start the React App:

npm start