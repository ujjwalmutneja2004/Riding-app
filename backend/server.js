const http=require('http');
const app=require('./app');
const dotenv=require('dotenv');
//dotenv.config() is a function from the dotenv package in Node.js. It is used to load environment variables from a .env file into the process.env object, making them accessible throughout your Node.js application.
dotenv.config();


const port = process.env.PORT || 3000;
const server=http.createServer(app);

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});


