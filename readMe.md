# ![Alt Text](./assets/Cineflixs.png)

![Last Commit](https://img.shields.io/github/last-commit/utibenoah/cineflixs)
![Node.js version](https://img.shields.io/badge/node-22.14.0-brightgreen)
![Express version](https://img.shields.io/badge/express-5.1.0-brightgreen)



 **Cinefix is a restful api that allows users to get current movies**


## File Structure
cineflixs/
├──assets
     └──logo
│

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

- **Response:**<br>

    {
    "id": "123",
    "title": "Inception",
    "year": 2010,
    "director": "Christopher Nolan"
    }



### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.
* [MongoDB](https://www.mongodb.com/) This is a free open source NOSQL document database with scalability and flexibility. Data are stored in flexible JSON-like documents.
* [Mongoose ODM](https://mongoosejs.com/) This makes it easy to write MongoDB validation by providing a straight-forward, schema-based solution to model to application data.
### Authors
* [Black Developa](https://github.com/blackdevelopa)
* ![alt text](https://avatars0.githubusercontent.com/u/29962968?s=400&u=7753a408ed02e51f88a13a5d11014484bc4d80ee&v=4)
### License
This project is available for use under the MIT License.
