# Node-High-Scale-Auth

This repository contains the **microservices code** designed to handle user authentication at **massive scale** — simulated for **1.9 Billion Logins/Month** — as demonstrated in the [I BUILT an Auth System that Handles 1.9 BILLION Logins/Month](https://www.youtube.com/watch?v=qYczG3j_FDo).

The architecture focuses on optimizing **Node.js performance** by isolating CPU-intensive tasks (bcrypt hashing) into a dedicated microservice, preventing the main API’s **Event Loop** from blocking under high concurrency.

> 🧠 **Note:**  
> This repository only contains the **application code** for the services.  
> It does **not** include Kubernetes deployment manifests (`.yaml` files), which will be provided in a separate repository or video.


---

## ⚙️ Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js** (v18 or higher)  
- **npm**, **pnpm**, or **yarn**  
- **PostgreSQL** (locally or via Docker)

You will also need to create a new table in your PostgreSQL database called `User` at least with the following columns:
- id (UUID)
- email (varchar)
- passwordHash (varchar)


### 🗄️ Database Configuration

Before starting the API, create a `.env` file inside the `api-service` directory with your PostgreSQL connection string:

```bash
# Example .env for PostgreSQL
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/your_db"
```

---

## 🚀 Installation and Local Execution

Follow these steps to spin up both microservices locally:

### 1️⃣ Clone the Repository

```bash
git clone git@github.com:vssalcedo/node-high-scale-auth.git
cd Node-High-Scale-Auth
```

### 2️⃣ Install Dependencies

Install dependencies for the **hasher service**:

```bash
cd hasher-service
npm install
```

Then, in a new terminal window, install dependencies for the **API service**:

```bash
cd ../api-service
npm install
```

### 3️⃣ Start the Hasher Service

The hasher service must be running first, since the API depends on it:

```bash
cd hasher-service
npm start
```

### 4️⃣ Start the Main Authentication API

Open a new terminal window and start the main API:

```bash
cd api-service
npm start
```

Your API should now be running at:  
👉 [http://localhost:3000](http://localhost:3000)

---

##  Links 

- [My Youtube channel](https://www.youtube.com/@vssalcedo)