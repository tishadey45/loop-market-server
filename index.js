require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs-extra");

const app = express();
const port = process.env.PORT || 5000;

//  middleware
app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());


// cloudinary configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer configuration
const upload = multer({
  dest: "uploads/",
});


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d2ts7wd.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB ✅",
    );
    const db = client.db("loop-market");
    const productsCollection = db.collection("products");


     app.post(
      "/add-product",
       upload.single("image"),
      async (req, res) => {
        try {
          const image = await cloudinary.uploader.upload(req.file.path, {
            folder: "loop-market",
          });
          await fs.remove(req.file.path);
          req.body.image = image.secure_url;
          req.body.seller = JSON.parse(req.body.seller);
          const products = req.body;
          // console.log("products",products)
          const result = await productsCollection.insertOne(products);
          res.send(result);
        } catch (error) {
          console.error("Error occurred while adding product:", error);
          res
            .status(500)
            .send({ error: true, message: "Internal server error" });
        }
      },
    );

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });


    app.get("/my-products/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { "seller.email": email };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const upDatedProduct = req.body;
      const upDateDoc = {
        $set: {
          room_name: upDatedProduct.room_name,
          floor: upDatedProduct.floor,
          capacity: upDatedProduct.capacity,
          hourly_rate: upDatedProduct.hourly_rate,
        },
      };
      const options = { upsert: true };
      const result = await productsCollection.updateOne(filter, upDateDoc, options);
      res.send(result);
    });

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("loop market server is running successfully ✅");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
