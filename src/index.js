const  { payment } = require('./routes/payments.js');




const app = express();

app.use(express.json());


app.use(morgan('dev'))

app.use(payment)

app.use(express.static(path.resolve('src/public')));
app.listen(3000);
console.log('Server on port ', 3000);

const Server = require('./models/server')
require('dotenv').config();

const server = new Server();

server.listen();