import express from 'express';
import payment from './routes/payments.js';
import morgan from 'morgan'
import path from 'path';



const app = express();

app.use(express.json());


app.use(morgan('dev'))

app.use(payment)

app.use(express.static(path.resolve('src/public')));
app.listen(3000);
console.log('Server on port ', 3000);