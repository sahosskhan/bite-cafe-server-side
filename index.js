const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }
  // bearer token
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}
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


    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      res.send({ token })
    })

    // Warning: use verifyJWT before using verifyAdmin
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      if (user?.role !== 'admin') {
        return res.status(403).send({ error: true, message: 'forbidden message' });
      }
      next();
    }

        //  get all user data from user collection
        app.get("/user-list",verifyJWT, verifyAdmin, async (req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result);
        });
  
   
      app.get('/users/admin/:email', verifyJWT, async (req, res) => {
        const email = req.params.email;
  
        if (req.decoded.email !== email) {
          res.send({ admin: false })
        }
  
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        const result = { admin: user?.role === 'admin' }
        res.send(result);
      })
  
      app.patch('/users/admin/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'admin'
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
  
      })


    // post user data into user collection
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersCollection.insertOne(user);
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

app.delete('/carts-delete-item/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})
  
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