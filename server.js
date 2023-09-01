import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

//load var
dotenv.config();

//start server
const app = express();

app.use(express.static('public'));
app.use(express.json());

//home route
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: "public" });
});

//stripe
let stripeGateway = stripe(process.env.stripe_api)

app.listen(3000, () => {
    console.log('listening on port 3000;');
});