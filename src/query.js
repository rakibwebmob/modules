const express = require("express");
const app = express();
const mongoose = require("mongoose");

const router = express.Router();
mongoose
  .connect("mongodb+srv://rakiballis:12345@cluster0.1rnldwq.mongodb.net/pagingnation-DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
  app.use(express.json())
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const itemSchema = new mongoose.Schema({
  // Define your fields here
  title: { type: String, required: true },
  description: { type: String, required: true },
});

itemSchema.index({ title: "text", description: "text" }); // Enable text indexing

const Item = mongoose.model("Item", itemSchema);


app.get('/items', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const searchQuery = req.query.search || ''; // Search query
  
    const query = searchQuery
      ? { description: { $regex: `^${searchQuery}`, $options: 'i' } } // Query search for matching first alphabet
      : {}; // Empty query for no search
  
    try {
      const count = await Item.countDocuments(query);
      const totalPages = Math.ceil(count / limit);
  
      const items = await Item.find(query)
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