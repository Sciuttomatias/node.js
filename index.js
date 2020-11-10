const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://sciuttomatias:fergab48073745@nerdflix.pwxtx.mongodb.net";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('catalogo');
    const collection = database.collection('peliculas');
    // Query for a movie that has the title 'matilda'
    const query = { title: 'matilda' };
    const movie = await collection.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);