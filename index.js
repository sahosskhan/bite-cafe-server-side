const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

//jwt token crate
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
  res.send({ token });
});
// verify jwt token
const verifyToken = (req, res, next) => {
  // console.log("inside verify token", req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

// verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.email) {
      throw new Error('Invalid token');
    }
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    if (!user || user.role !== 'admin') {
      throw new Error('User is not an admin');
    }
    next();
  } catch (error) {
    console.error('Error in verifyAdmin middleware:', error);
    res.status(403).send({ message: 'Forbidden access' });
  }
}

// filter admin user
app.get("/users/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const email = req.params.email;
    if (email !== req.decoded.email) {
      throw new Error('Email in params does not match token');
    }
    const query = { email: email };
    const user = await userCollection.findOne(query);
    if (!user) {
      throw new Error('User not found');
    }
    const admin = user.role === "admin";
    res.send({ admin });
  } catch (error) {
    console.error('Error in /users/admin/:email route:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// get all user data from user collection
app.get("/users",verifyToken,verifyAdmin, async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});




        //  get all user data from user collection
        app.get("/user-list", async (req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result);
        });

  
  app.patch('/users/admin/:id', async (req, res) => {
  const id = req.params.id;
  // Validate the format of the ID parameter
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).send({ message: 'Invalid ID format' });
  }

  try {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: 'admin'
      },
    };

    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

        


    // post user data into user collection
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
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



  app.post('/add-menu-items',  async (req, res) => {
    const newItem = req.body;
    const result = await menuCollection.insertOne(newItem)
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