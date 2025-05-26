const dotenv = require('dotenv');
const Movie = require('./../Models/moviesModels');
const mongoose = require('mongoose');
const fs = require('fs');

// Load env variables
dotenv.config({ path: './config.env' });

// CONNECT DATABASE
mongoose.connect(process.env.MONGODB_CONN_STR)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Error occurred while connecting to database: ' + err));

// LOAD MOVIES.JSON FILE
//let movies = JSON.parse(fs.readFileSync('./Data/movies.json'));
let movies = JSON.parse(fs.readFileSync('./Data/movies.json', 'utf-8'));


// DELETE EXISTING MOVIES
let deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('Data deleted from database successfully');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
};

// IMPORT MOVIES
let importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Data imported to database successfully');
    } catch (err) {
        console.log(err.message);
    }
    process.exit();
};

// Choose which function to run
// Uncomment one of the following lines to run:

// importMovies();
// deleteMovies();

if (process.argv[2]==='--import') {
    importMovies()
}

if (process.argv[2]==='--delete') {
    deleteMovies()
}