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

## 🚢 Deployment to DigitalOcean

This project includes infrastructure-as-code (Terraform) and deployment scripts to deploy the entire stack to DigitalOcean Kubernetes.

### Prerequisites

Before deploying, ensure you have:

- **Terraform** installed (v1.5.0 or higher)
- **DigitalOcean CLI** (`doctl`) installed and authenticated
- **kubectl** installed
- **Helm** installed (for SigNoz observability)
- A **DigitalOcean API token** with appropriate permissions
- A **Google Cloud service account key** (JSON) for pulling Docker images from GCR (stored as `infra/concurrent-login-docker-images-key.json`)

### 1️⃣ Configure Terraform Variables

Navigate to the `infra` directory and create or edit `terraform.tfvars`:

```bash
cd infra
```

Adapt the following variables in `variables.tf` to your needs:

```hcl
region                = "nyc1"  # or your preferred region
api_instance_type     = "s-4vcpu-8gb"
hashing_instance_type = "s-8vcpu-16gb"
min_hashing_nodes     = 1
max_hashing_nodes     = 19
```

Set the following variable in `terraform.tfvars`:

```bash
do_token = "{{ your_own_do_token }}"
```

### 2️⃣ Run the Deployment Script

The `deploy.sh` script automates the entire deployment process:

```bash
cd infra
./deploy.sh
```

This script will:

1. **Provision Infrastructure**: Apply Terraform to create a DigitalOcean Kubernetes cluster with two node pools:
   - `api-pool`: Auto-scaling pool (1-5 nodes) for the API service
   - `hashing-pool`: Auto-scaling pool (1-19 nodes) for CPU-intensive hashing operations

2. **Configure kubectl**: Connect to the newly created cluster

3. **Set up Secrets**: Create Docker registry secrets for pulling images from Google Container Registry

4. **Deploy Services**: Apply all Kubernetes manifests (deployments, services, HPA, etc.)

5. **Install Dependencies**: 
   - Install Kubernetes Metrics Server for HPA
   - Install SigNoz for observability and monitoring

6. **Restart Deployments**: Ensure all services are running with the latest configuration

### 3️⃣ Verify Deployment

After the script completes, verify your deployment:

```bash
# Check cluster status
kubectl get nodes

# Check all pods
kubectl get pods

# Check services
kubectl get services

# Check HPA status
kubectl get hpa
```

### 4️⃣ Access SigNoz Dashboard

To access the SigNoz observability dashboard:

```bash
# Port-forward to access SigNoz UI
kubectl port-forward -n signoz svc/signoz-frontend 3301:3301
```

Then open [http://localhost:3301](http://localhost:3301) in your browser to access the SigNoz dashboard.

---

##  Links 

- [My Youtube channel](https://www.youtube.com/@vssalcedo)