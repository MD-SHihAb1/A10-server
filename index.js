require('dotenv').config();
const express = require('express');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors())
app.use(express.json())



// Middleware 






// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oldlbnp.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oldlbnp.mongodb.net/?retryWrites=true&w=majority`;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oldlbnp.mongodb.net/?retryWrites=true&w=majority`;




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
    // Connect the client to the server	(optional starting in v4.7)

    // await client.connect();

    const paintingCollection = client.db('paintingDB').collection('painting');


    



    app.get('/painting', async(req, res) =>{
      const cursor = paintingCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    

    app.get('/painting/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await paintingCollection.findOne(query);
      res.send(result)
    })
    




    app.post('/painting', async(req, res) =>{
      const newPainting = req.body;
      console.log(newPainting);
      const result = await paintingCollection.insertOne(newPainting);
      res.send(result);
    })


    app.delete('/painting/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id) }
        const result = await paintingCollection.deleteOne(query);
        res.send(result);
    })




























  //   app.get('/painting', async (req, res) => {
  //     try {
  //         const cursor = paintingCollection.find();
  //         const result = await cursor.toArray();
  //         res.send(result);
  //     } catch (error) {
  //         console.error("Error fetching paintings:", error);
  //         res.status(500).send("Error fetching paintings");
  //     }
  // });






  app.put('/painting/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const option = { upsert: true};
    const updatedPainting = req.body;
    const painting = {
      $set: {
        photo: updatedPainting.photo,
        name: updatedPainting.name,
        subcategory_Name: updatedPainting.subcategory_Name,
        short_description: updatedPainting.short_description,
        price: updatedPainting.price,
        rating: updatedPainting.rating,
        customization: updatedPainting.customization,
        processing_time: updatedPainting.processing_time,
        stock: updatedPainting.stock,
        user_Name: updatedPainting.user_Name,
        email: updatedPainting.email,
      }
    }


    const result = await paintingCollection.updateOne(filter, painting, option)
    res.send(result);

  })






  
  app.get('/painting/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await paintingCollection.findOne(query);
          if (!result) {
              return res.status(404).send("Painting not found");
          }
          res.send(result);
      } catch (error) {
          console.error("Error fetching painting by ID:", error);
          res.status(500).send("Error fetching painting by ID");
      }
  });
  

 





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }




}
run().catch(console.dir);

app.get('/', (req, res ) =>{
    res.send('This Is Painting Server Is Running')
})

app.listen(port, () =>{
    console.log(`This Is A Painting Server Is Running On Port: ${port}`)
})
