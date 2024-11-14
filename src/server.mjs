import app from "./app.mjs";
import { connectToDatabase } from "./config/db.mjs";
const port = process.env.PORT || 3030;
const db = process.env.MONGO_URI;

// Connect to MongoDB
connectToDatabase(db);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
