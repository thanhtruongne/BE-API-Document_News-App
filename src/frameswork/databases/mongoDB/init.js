const connectionInit = (mongoose,url) => {
  const connectToMongo = () => {
    if(1 == 1) { // môi trg dev
      mongoose.set('debug',true);
      mongoose.set('debug',{color : true});
    }
    mongoose
      .connect(url)
      .then(_ => {
        console.log('Successfully connected MongoDB')
    })
    .catch( err => {
      console.log('DB connection error');
      throw new Error(err);
    });
  }

  mongoose.connection.on('connected', () => {
    console.info('Connected to MongoDB!');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected!');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
  });

  mongoose.connection.on('disconnected', () => {
    console.error(
      `MongoDB disconnected! Reconnecting in ${
        options.reconnectInterval / 1000
      }s...`
    );
    setTimeout(() => connectToMongo(), options.reconnectInterval);
  });

  return {
    connectToMongo
  };
}



export default connectionInit;


