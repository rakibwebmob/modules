const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb+srv://rakiballis:12345@cluster0.1rnldwq.mongodb.net/pagingnation-DB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });


app.use(express.json())

const itemSchema = new mongoose.Schema({
  // Define your fields here
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Item = mongoose.model('Item', itemSchema);

// module.exports = Item;


app.post("/items",async(req,res)=>{
    try {
        console.log(req.body);
    const item=await Item.create(req.body)
    console.log(item);
    res.status(201).send(item);
    } catch (error) {
        console.error('Error fetching items', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/items', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 15; // Number of items per page
  
    try {
      const count = await Item.countDocuments();
      const totalPages = Math.ceil(count / limit);
  
      const items = await Item.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
   
      res.json({
        items,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching items', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.all("/**",  (req, res) => {
    res.status(400).send({ status: false, msg: "The api you request is not available" })
});

app.get("/",(req,res)=>{
    res.send("hello")
})                           

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  