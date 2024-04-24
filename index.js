const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
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
    
  //  get all user data from user collection
      app.get("/user-list", async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
      });
   
   
      // get all menus from menu collection
    app.get('/show-all-menu', async(req, res) =>{
      const result = await menuCollection.find().toArray();
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