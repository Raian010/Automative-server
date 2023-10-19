const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plereka.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const cars = client.db("cars");
    const carsCollection = cars.collection("collection");

    const carts = client.db("cars");
    const cartsCollection = carts.collection("carts");

    app.get("/cars", async(req,res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // app.get("/cars/:id", async(req,res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: new ObjectId(id)};
    //   const result = await carsCollection.findOne(query);
    //   res.send(result)
    // })

    app.post("/cars", async(req,res) => {
      const user = req.body;
      console.log(user);
      const result = await carsCollection.insertOne(user);
      res.send(result);
    })



    // Carts collection
   app.get("/carts", async(req,res) => {
    const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
   })

    app.post("/carts", async(req,res) => {
      const user = req.body;
      const result = await cartsCollection.insertOne(user);
      res.send(result);
    })

    app.delete("/carts/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

