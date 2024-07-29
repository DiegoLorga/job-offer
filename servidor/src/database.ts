 //para poder interactuar con MongoDB se importa la librería Mongoose
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    //realizamos la conexión con nuestra base de datos
    await mongoose.connect('mongodb://localhost/OfertaLaboral');
    console.log("Base de datos conectada");
  }
  catch (error) {
    console.log(error);
  }
}