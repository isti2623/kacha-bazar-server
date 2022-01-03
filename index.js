const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const port = 5000;

app.use(cors())
app.use(express.json());



const uri = "mongodb+srv://mydbuser1:an9UDvjpwCGLguuP@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaster");
        const userCollection = database.collection("user");

        //Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.json(result);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!I am MongoDB')
})
app.get('/users', (req, res) => {
    res.send('Hello World!I am MongoDB')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})