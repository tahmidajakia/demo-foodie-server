const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




// middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@foodie-cluster.e2b4b.mongodb.net/foodie-cluster?retryWrites=true&w=majority&appName=foodie-cluster`)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));


    app.post('/jwt', async(req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1hr'
      })
      res.send({token});
    })


    


// import routes
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes')
const paymentRoutes = require('./api/routes/paymentRoutes')
const adminStats =  require('./api/routes/adminStats');
const orderStats = require('./api/routes/orderStats')
app.use('/menu', menuRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes)
app.use('/admin-stats', adminStats);
app.use('/order-stats', orderStats);


// stripe payment routes
 // Create a PaymentIntent with the order amount and currency
 app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;

  if (!price || typeof price !== 'number' || price < 1) {
    return res.status(400).send({ error: "Invalid price value" });
  }

  const amount = price * 100; // Convert price to cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).send({ error: "Payment Intent creation failed" });
  }
});



// res.send({
//   clientSecret: paymentIntent.client_secret,
//   // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
//   dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
// });



// Root endpoint
app.get('/', (req, res) => {
    res.send('Foodies is sitting');
});

// Start server
app.listen(port, () => {
    console.log(`Foodies is sitting on port ${port}`);
});



// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config()
// const port = process.env.PORT || 5000;

// // middlewares
// app.use(cors());
// app.use(express.json());



// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@foodie-cluster.e2b4b.mongodb.net/?retryWrites=true&w=majority&appName=foodie-cluster`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const menuCollection = client.db("foodieeDb").collection("menus");
//     const cartCollection = client.db("foodieeDb").collection("carts");


//     app.get('/menus',  async(req,res) => {
//         const result = await menuCollection.find().toArray();
//         res.send(result);
//       });
       
//       // posting cart to db
//       app.post('/carts', async(req,res) => {
//         const cartItems = req.body;
//         const result = await cartCollection.insertOne(cartItems)
//         res.send(result)
//       })


//       //  get cart using email
//       app.get('/carts', async(req,res) => {
//         const email = req.query.email;
//         const filter = {email: email}
//         const result = await cartCollection.find(filter).toArray();
//         res.send(result)
//     })


//     app.get('/carts/:id', async(req,res) => {
//       const id = req.params.id;
//       const filter = {_id : new ObjectId(id)};
//       const result = await cartCollection.findOne(filter);
//       res.send(result)
//     })

//     // delete item from cart
//     app.delete('/carts/:id', async(req,res) => {
//       const id = req.params.id;
//       const filter = {_id : new ObjectId(id)};
//       const result = await cartCollection.deleteOne(filter);
//       res.send(result)
//     })
  

//     // update carts quantity

//     app.put('/carts/:id', async(req,res) => {
//       const id = req.params.id;
//       const {quantity} = req.body;
//       const filter = {_id: new ObjectId(id)};
//       const option = { upsert: true};
//       const updateDoc = {
//         $set : {
//             quantity: parseInt(quantity, 10)
//         }
//       }

//       const result = await cartCollection.updateOne(filter,updateDoc,option);
//       res.send(result)
//     });




//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);



// app.get('/', (req,res) => {
//     res.send('foodies is siting')
// });

// app.listen(port, () => {
//     console.log(`Foodies is sitting on port ${port}`)
// })