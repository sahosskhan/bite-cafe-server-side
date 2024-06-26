const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')

// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("BiteCafedb");
    const userCollection = database.collection("Users");
    const menuCollection = database.collection("menu");
    const reviewCollection = database.collection("reviews");
    const cartCollection = database.collection("carts");
    const paymentCollection = database.collection("payments");
    const bookingsCollection = database.collection("bookings");

// middleware & jwt authentication & verification related api

//jwt crate
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "2h" });
  res.send({ token });
});
// verify token
const verifyToken = (req, res, next) => {
  // console.log("inside verify token", req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};



    // user related api
    // get user filter on role for admit verification
    app.get("/users/admin/:email",  async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    //  get all user data from user collection
    app.get("/user-list",   async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // update one user role using patch request
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
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

    // delete one user data from user collection
    app.delete("/user-delete-one/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });



    //  menu related api

    // get all menus from menu collection
    app.get("/show-all-menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

  // get one menu filter on _id from menu collection
    app.get("/show-one-menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.findOne(query);
      res.send(result);
    });

    // post menu data into menu collection
    app.post("/add-menu-items", async (req, res) => {
      const newItem = req.body;
      const result = await menuCollection.insertOne(newItem);
      res.send(result);
    });

    // edit menu date into menu collection using patch request
    app.patch("/edit-menu-items/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: item.name,
          category: item.category,
          price: item.price,
          recipe: item.recipe,
          image: item.image,
        },
      };
      const result = await menuCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

  // delete one menu data from menu collection
    app.delete("/menu-delete-one/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.deleteOne(query);
      res.send(result);
    });




    // cart related api

    // post cart data to cart collection
    app.post("/carts-add-item", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // get all carts data filter by current login email from cart collection
    app.get("/show-all-carts", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // delete one cart data from cart collection
    app.delete("/carts-delete-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });



    // payment related api

    // create payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
// post payment & order information in payment collection & delete order from cart collection
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const insertResult = await paymentCollection.insertOne(payment);
      const cartItemIds = payment.cartItems.map((id) => new ObjectId(id));
      const query = { _id: { $in: cartItemIds } };
      const deleteResult = await cartCollection.deleteMany(query);
      res.send({ insertResult, deleteResult });
    });

     // get all payments data filter by current login email from payment collection
    app.get("/show-all-payments", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
     // get all payments  from payment collection
    app.get("/all-payments", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.send(result);
    });

    // aggregate related api
    app.get("/admin-stats", async (req, res) => {
      const users = await userCollection.estimatedDocumentCount();
      const menuItems = await menuCollection.estimatedDocumentCount();
      const orders = await paymentCollection.estimatedDocumentCount();

      const result = await paymentCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ])
        .toArray();

      const revenue = result.length > 0 ? result[0].totalRevenue : 0;

      res.send({
        users,
        menuItems,
        orders,
        revenue,
      });
    });


    // booking related api

    // send booking data to booking collection
    app.post("/bookings-data-send", async (req, res) => {
      const bookings = req.body;
      const result = await bookingsCollection.insertOne(bookings);
      res.send(result);
    });

         // get all bookings data filter by current login email from bookings collection
         app.get("/show-all-bookings", async (req, res) => {
          const email = req.query.email;
    
          if (!email) {
            res.send([]);
          }
          const query = { email: email };
          const result = await bookingsCollection.find(query).toArray();
          res.send(result);
        });

            // delete one bookings data from collection
    app.delete("/delete-bookings-one/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
    
        // get all bookings from collection
        app.get("/get-all-bookings", async (req, res) => {
          const result = await bookingsCollection.find().toArray();
          res.send(result);
        });

    // update booking approved using patch request
    app.patch("/approve-booking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await bookingsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });


        // update booking rejected using patch request
        app.patch("/reject-booking/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedDoc = {
            $set: {
              status: "rejected",
            },
          };
          const result = await bookingsCollection.updateOne(filter, updatedDoc);
          res.send(result);
        });


        // update booking rejected using patch request
        app.patch("/re-booking/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedDoc = {
            $set: {
              status: "pending",
            },
          };
          const result = await bookingsCollection.updateOne(filter, updatedDoc);
          res.send(result);
        });



    // review related api

    // show review data from collection
    app.get("/show-all-reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    // send reviews data to collection
    app.post("/reviews-data-send", async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.send(result);
    });
    
          // get all reviews data filter by current login email from  collection
          app.get("/show-my-reviews", async (req, res) => {
            const email = req.query.email;
      
            if (!email) {
              res.send([]);
            }
            const query = { email: email };
            const result = await reviewCollection.find(query).toArray();
            res.send(result);
          });
  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bite Cafe  is running");
});

app.listen(port, () => {
  console.log(`Bite Cafe is running on port ${port}`);
});
