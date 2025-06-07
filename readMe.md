# ![Alt Text](./assets/Cineflixs.png)

![Last Commit](https://img.shields.io/github/last-commit/utibenoah/cineflixs)
![Node.js version](https://img.shields.io/badge/node-22.14.0-brightgreen)
![Express version](https://img.shields.io/badge/express-5.1.0-brightgreen)



 **Cinefix is a restful api that allows users to get current movies**


## File Structure

## Installation
Follow these steps to get the project running locally:

1. **Clone the repository:**

   ```bash
    git clone https://github.com/utibenoah/cineflixs.git

2. **Navigate to repository:**
    ```bash
    cd cineflixs
3.  **Install dependencies** 
    ```bash
    npm install
4.  **Run Project:**
    ```bash
    npm start

## Usage

### Base URL
- http://127.0.0.1:3000/api/v1


### Endpoints

#### Get All Movies

- **Description:** Fetches a list of all movies.
- **Request:**
  ```http
  GET http://127.0.0.1:3000/api/v1/movies

- **Response:**

    ```json
    {
    "id": "123",
    "title": "Inception",
    "year": 2010,
    "director": "Christopher Nolan"
    }

