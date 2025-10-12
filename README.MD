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

2.  **Install dependencies:**  
    This installs `concurrently`, which is used to run both servers with one command.

    ```bash
    npm install
    ```

3.  **Set up MySQL database**  
    Go to the [README](https://github.com/bionic-ear-lab/team-hearing/blob/487a045e18d391363bd56606b80470b141b31d29/database/README.md)

4.  **Download piano files locally**  
    Expand *pitchshifted.zip* found in *frontend/public/musescore/libary/piano/pitchshifted*  
    Note: This only contains the wav files for piano_45. As tests are expanded for more notes, they would have to be downloaded.
    All files available on [Dropbox](https://www.dropbox.com/scl/fo/1s7gxjlud0iohaco5ct7z/AOKAzUPmQX1NmmzKPM3jU7M?dl=0&rlkey=zm05o9qs7nm9cghlrg4ri8sv2).

5.  **Run the application:**  
    This is the main command to start both the backend and frontend servers. Run this for local testing.

    ```bash
    npm run dev
    ```

    You should see output from both servers in your terminal.

      * Access the **Frontend** at `http://localhost:5173`  
      The frontend links to the API. Use this to access the full site.
      * The backend **API** is available at `http://localhost:8080`

-----

## TO BE FIXED Production Build and Deployment 

For production, the Vite frontend is built into static files, which are then served by the Spring Boot application. This results in a single, self-contained `.jar` file that can be easily deployed.

### Step 1: Build the Frontend

This command compiles your frontend code into optimized, static HTML, CSS, and JavaScript files.

```bash
npm --prefix frontend run build
```

After this step, you will have a new `dist` folder inside the `frontend` directory (`frontend/dist`).

### Step 2: Copy Static Assets to Spring Boot

Manually copy the **contents** of the `frontend/dist` directory into the Spring Boot static resources folder at `backend/src/main/resources/static`.

  * **Source:** `frontend/dist/*`
  * **Destination:** `backend/src/main/resources/static/`

**Note:** Make sure the `static` directory is empty before copying the new files to avoid conflicts.

### Step 3: Package the Spring Boot Application

This command compiles the Java code and packages the entire application, including the frontend assets, into a single executable `.jar` file.

```bash
./mvnw -f backend/pom.xml clean package
```

The final `.jar` file will be located in the `backend/target/` directory. The filename will typically be something like `backend-0.0.1-SNAPSHOT.jar`.

### Step 4: Run the Production Application

Launch the application using the `java -jar` command.

```bash
java -jar backend/target/your-app-name-0.0.1-SNAPSHOT.jar
```

The entire application (both frontend and backend) is now running on a single port and can be accessed at `http://localhost:8080`.
You can run a bash script that runs all of step 3!!!
Make it executable: 
```bash
chmod -x build-and-run.sh
```
Run it:
```bash
./build-and-run.sh
```

