# How to Run the Project

You need to run the Server (Backend) and the Client (Frontend) in two separate terminals.

## 1. Start the Backend Server
The server handles the API and Database connection.

1. Open a terminal.
2. Navigate to the server folder:
   ```powershell
   cd d:\MyPortfilio\server
   ```
3. Install dependencies (if you haven't already):
   ```powershell
   npm install
   ```
4. Start the server:
   ```powershell
   npm start
   ```
   *(Or `npm run dev` for development mode)*

## 2. Start the Frontend Client
The client is the React/Next.js interface you see in the browser.

1. Open a **new** terminal.
2. Navigate to the client folder:
   ```powershell
   cd d:\MyPortfilio\client
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

## 3. Access the Application
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Note:** Ensure your MongoDB local server is running or your `.env` file in the server points to a valid MongoDB Atlas URI.
