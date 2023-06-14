import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables from .env file

const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME ,DB_CLUSTER} = process.env;
const dbUrl = DB_URL.replace('<username>', DB_USERNAME).replace('<password>', DB_PASSWORD).replace("<cluster-url>",DB_CLUSTER).replace("<db-name>", DB_NAME);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export { connectToDatabase };