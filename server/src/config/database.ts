import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/VGRanked-db';
    await mongoose.connect(uri);
    console.log(' Conectado exitosamente a MongoDB (VGRanked-db)');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};
