const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { query } = require('express');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('kacha-bazar');
        const addProductCollection = database.collection('addProduct');
        const usersCollection = database.collection('userInfo');
        const reviewCollection = database.collection('review');


        //Product Get Api
        app.get('/addProduct', async (req, res) => {
            const cursor = addProductCollection.find({});
            const bloodPostReq = await cursor.toArray();
            res.send(bloodPostReq);
        })


        //Product DELETE Api
        app.delete('/addProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addProductCollection.deleteOne(query);
            res.send(result);
        })


        //Product POST Api
        app.post('/addProduct', async (req, res) => {
            const bloodPostReq = req.body;
            const result = await addProductCollection.insertOne(bloodPostReq);
            res.json(result)
        })

        //Product Get Api email search
        app.get('/addProductDashboard', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = addProductCollection.find(query);
            const bloodPostReq = await cursor.toArray();
            res.send(bloodPostReq);
        })

        //find user admin by email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //User Sign up POST Api
        app.post('/userInfo', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //User google sign in  PUT/Upsert Api
        app.put('/userInfo', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //Users  Make Admin
        app.put('/userInfo/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //Post add Reviews
        app.post("/addReviews", (req, res) => {
            reviewCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //Post add Reviews
        app.post("/addReviews", (req, res) => {

            reviewCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //GET  Reviews API
        app.get('/addReviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const events = await cursor.toArray();

            res.send(events);
        });


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Kacha Bazar!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})