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
  }),
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
    const orderCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    app.post("/add-product", upload.single("image"), async (req, res) => {
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
        res.status(500).send({ error: true, message: "Internal server error" });
      }
    });

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

    app.get("/all-products", async (req, res) => {
      const result = await productsCollection.find().toArray();
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
          title: upDatedProduct.title,
          category: upDatedProduct.category,
          condition: upDatedProduct.condition,
          price: upDatedProduct.price,
          stock: upDatedProduct.stock,
          description: upDatedProduct.description,
          status: upDatedProduct.status,
        },
      };
      const options = { upsert: true };
      const result = await productsCollection.updateOne(
        filter,
        upDateDoc,
        options,
      );
      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const order = req.body;
      // console.log(order);
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/customers-bookings/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { sellerEmail: email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/all-bookings", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    app.patch("/api/bookings/:id/cancel", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      const updateDoc = {
        $set: {
          status: "cancelled",
        },
      };
      const options = { upsert: true };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options,
      );
      res.send(result);
    });

    app.post("/api/users", async (req, res) => {
      try {
        const user = req.body;
        // console.log("user", user);
        const filter = { email: user.email };
        const userDocument = {
          $set: {
            name: user.name,
            email: user.email,
            image: user.image || user.photo,
            role: user.role || "seller",
            updatedAt: new Date(),
          },

          $setOnInsert: {
            createdAt: new Date(),
          },
        };

        const options = { upsert: true };
        const result = await usersCollection.updateOne(
          filter,
          userDocument,
          options,
        );

        res.status(200).send({ success: true, result });
      } catch (error) {
        console.error("Error saving user:", error);
        res
          .status(500)
          .send({ success: false, message: "Internal server error" });
      }
    });

    app.get("/api/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //update user role
    app.patch("/api/users/role/:id", async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { role } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //block user
    app.patch("/api/users/block/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: "blocked" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
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
