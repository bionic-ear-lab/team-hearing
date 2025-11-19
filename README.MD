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
