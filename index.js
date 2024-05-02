const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db("BiteCafedb").collection("Users");
    const menuCollection = client.db("BiteCafedb").collection("menu");
    const reviewCollection = client.db("BiteCafedb").collection("reviews");
    const cartCollection = client.db("BiteCafedb").collection("carts");
    const paymentCollection = client.db("BiteCafedb").collection("payments");



    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });


        //  get all user data from user collection
        app.get("/user-list", async (req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result);
        });

  
        app.patch("/users/admin/:id", async  (req, res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id)};
          const updatedDoc = {
            $set: {
              role: "admin",
            },
          };
          const result = await userCollection.updateOne(filter, updatedDoc);
          res.send(result);
        });

        


    // post user data into user collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedInd: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete('/user-delete-one/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
      
   
   
      // get all menus from menu collection
    app.get('/show-all-menu', async(req, res) =>{
      const result = await menuCollection.find().toArray();
      res.send(result);
  })

  app.get('/show-one-menu/:id', async(req, res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await menuCollection.findOne(query);
    res.send(result);
})



  app.post('/add-menu-items',  async (req, res) => {
    const newItem = req.body;
    const result = await menuCollection.insertOne(newItem)
    res.send(result);
  })

  app.patch('/edit-menu-items/:id',  async (req, res) => {
    const item = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
 const updatedDoc = {
  $set:{
    name: item.name,
    category: item.category,
    price: item.price,
    recipe: item.recipe,
    image: item.image
  }
 }
 const result = await menuCollection.updateOne(filter,updatedDoc)
    res.send(result);
  })


  app.delete('/menu-delete-one/:id',  async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await menuCollection.deleteOne(query);
    res.send(result);
  })




       // get all reviews from review collection
  app.get('/show-all-reviews', async(req, res) =>{
    const result = await reviewCollection.find().toArray();
    res.send(result);
})
// post cart data to cart collection
app.post('/carts-add-item', async (req, res) => {
  const item = req.body;
  console.log(item);
  const result = await cartCollection.insertOne(item);
  res.send(result);
})

app.get('/show-all-carts', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.send([]);
  }
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result);
});

app.delete('/carts-delete-item/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})



 // create payment intent
 app.post('/create-payment-intent',  async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
})


// payment related api
app.post('/payments',  async (req, res) => {
  const payment = req.body;
  const insertResult = await paymentCollection.insertOne(payment);
  const cartItemIds = payment.cartItems.map(id => new ObjectId(id));
  const query = { _id: { $in: cartItemIds } };
  const deleteResult = await cartCollection.deleteMany(query);

  res.send({ insertResult, deleteResult });
})


app.get('/show-all-payments', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.send([]);
  }
  const query = { email: email };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
});


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bite Cafe  is running')
})

app.listen(port, () => {
    console.log(`Bite Cafe is running on port ${port}`);
})