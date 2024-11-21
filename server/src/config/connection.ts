import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ethan:aoioWnNJCQ8deYMI@cluster0.f49g2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

export default mongoose.connection;
