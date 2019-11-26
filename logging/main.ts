import express from 'express';
import bodyParser from 'body-parser';
import LogController from './LogController';


const logController = new LogController;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/')
    .get((req,res)=>{
        res.status(200);
        res.json({ message :'hola mundo' });
    });

app.route('/notifications/addartist')
    .post((req,res)=>{
        logController.handleAddArtist(req, res); 
    })