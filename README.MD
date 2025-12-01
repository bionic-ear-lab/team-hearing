# Team Hearing Project

This is a full-stack web application built with a **Spring Boot** backend and a **Vite**-powered frontend.

The project is configured to run both the backend and frontend servers concurrently for a smooth development experience.

-----

## Prerequisites

Before you begin, ensure you have the following installed on your system:

  * **Java JDK 17** or later
  * **Node.js v18** or later (which includes npm)

-----

## Development Setup 

Follow these steps to get your development environment running. In this mode, the Vite server runs on port `5173` and the Spring Boot server runs on port `8080`.

1.  **Clone the repository:**  

    ```bash
    git clone https://github.com/bionic-ear-lab/team-hearing.git
    cd team-hearing
    ```

2.  **Install node dependencies:**  

    ```bash
    npm install
    ```

3.  **Set up MySQL database**  
    Go to the [README](https://github.com/bionic-ear-lab/team-hearing/blob/487a045e18d391363bd56606b80470b141b31d29/database/README.md)

4.  **Download piano files locally**  
    Expand *pitchshifted.zip* found in *frontend/public/musescore/libary/piano/pitchshifted*  
    All files available on [Dropbox](https://www.dropbox.com/scl/fo/1s7gxjlud0iohaco5ct7z/AOKAzUPmQX1NmmzKPM3jU7M?dl=0&rlkey=zm05o9qs7nm9cghlrg4ri8sv2).

5.  **Run the application:**  
    This is the main command to start both the backend and frontend servers. Run this for local testing.

    ```bash
    npm run dev
    ```

    You should see output from both servers in your terminal.

      * Access the **Frontend** at `http://localhost:5173`  
      The frontend links to the API. Use this to access the full site.
      * The backend **API** is available at `http://localhost:8080` if you need to access only that.



## Docker Setup (Backend + Frontend + MySQL)

For deployment, demos, or when you don’t want to install Java/Node/MySQL locally, you can run the app using Docker. Docker will run:

- **MySQL 8** database  
- **Spring Boot backend** (which serves the built React frontend)

All of this is orchestrated via `Dockerfile` and `docker-compose.yml` in the project root.

### Docker Prerequisites

- **Docker Desktop** (or Docker Engine) installed and running  
- Optional: `docker-compose` CLI (bundled with recent Docker Desktop versions)

You do **not** need local Java, Node, or MySQL when using the full Docker setup.

### Building and Running with Docker

From the project root (`team-hearing`):

```bash
docker-compose up --build
```

- `--build` ensures the Docker image is rebuilt if the code has changed.
- The first run will take a few minutes while it:
  - Installs frontend dependencies and builds the React app
  - Builds the Spring Boot backend JAR
  - Starts MySQL and initializes the `musiclovers` database from `database/init.sql`

Once the containers are up:

- **Application (frontend + backend)**: `http://localhost:8080`  
- **MySQL**: `localhost:3306` (user: `root`, password: `root`, database: `musiclovers`)

To run in the background (detached mode):

```bash
docker-compose up --build -d
```

### Stopping and Cleaning Up

**Stop containers but keep volumes/data:**

```bash
docker-compose down
```

**Stop containers and remove the database volume (fresh DB next time):**

```bash
docker-compose down -v
```

### Inspecting and Debugging

**Check running containers:**

```bash
docker-compose ps
```

**View logs:**

```bash
docker-compose logs -f          # all services
docker-compose logs -f backend  # backend only
docker-compose logs -f mysql    # database only
```

**Check that the database is reachable and initialized:**

```bash
docker-compose exec mysql mysql -uroot -proot musiclovers -e "SHOW TABLES;"
```

You should see `users`, `devices`, and `tests`.

### How the Docker Setup Works

- **`Dockerfile`** (multi-stage):
  - Builds the React frontend with Node
  - Copies the built static files into the Spring Boot `static` resources
  - Builds the backend JAR with Maven (Java 21)
  - Runs the JAR on a lightweight JRE image
- **`docker-compose.yml`**:
  - Starts `mysql` (MySQL 8) with:
    - Database: `musiclovers`
    - User/password: `root` / `root`
    - Initialization script: `database/init.sql`
  - Starts `backend` using the Dockerfile:
    - Connects to MySQL via `SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/musiclovers?...`
    - Exposes port `8080` on the host
- **`application-docker.properties`**:
  - Used when `SPRING_PROFILES_ACTIVE=docker`
  - Tells Spring Boot to use the Dockerized MySQL connection details

### Typical Workflows

- **Local development (full dev experience):**
  - Use `npm run dev` as described in the *Development Setup* section.
- **Quick demo / testing on another machine:**
  - Install Docker Desktop
  - Clone this repo
  - Run `docker-compose up --build -d`
  - Visit `http://localhost:8080`
- **Reset everything (including DB):**
  - `docker-compose down -v`
  - `docker-compose up --build`

