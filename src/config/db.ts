import mongoose, { ConnectOptions } from 'mongoose';
import { mongoDbUrl } from '../secret';

export const connectDB = async (options: ConnectOptions = {}): Promise<void> => {
  try {
    if (!mongoDbUrl) {
      throw new Error('MongoDB URL is not defined in secret.ts');
    }

    await mongoose.connect(mongoDbUrl, options);
    console.log('Connection Successful');

    mongoose.connection.on('error', (error) => {
      console.error('DB Connection error:', error);
    });

  } catch (error) {
    console.error('Could not connect to DB:', (error as Error).message);
  }
};