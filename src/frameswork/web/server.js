import { createTerminus } from '@godaddy/terminus';

const serverConfig = (app,server,mongoose) => {
    const healthCheck = () => {
        if (
            mongoose.connection.readyState === 0 ||
            mongoose.connection.readyState === 3
          ) {
            return Promise.reject(new Error('Mongoose has disconnected'));
          }
          if (mongoose.connection.readyState === 2) {
            return Promise.reject(new Error('Mongoose is connecting'));
          }
          return Promise.resolve();
      }
    
      function onSignal() {
        console.log('server is starting cleanup');
        return new Promise((resolve, reject) => {
          mongoose
            .disconnect(false)
            .then(() => {
              console.info('Mongoose has disconnected');
              resolve();
            })
            .catch(reject);
        });
      }
    
      function beforeShutdown() {
        return new Promise((resolve) => {
          setTimeout(resolve, 15000);
        });
      }
    
      function onShutdown() {
        console.log('cleanup finished, server is shutting down');
      }
    
      function startServer() {
        console.log(process.env.PORT)
        createTerminus(server, {
          logger: console.log,
          signal: 'SIGINT',
          healthChecks: {
            '/healthcheck': healthCheck
          },
          onSignal,
          onShutdown,
          beforeShutdown
        }).listen(process.env.PORT, () => {
          console.log('Express server listening on %d',process.env.PORT);
        });
      }
    
      return {
        startServer
      };
}
export default serverConfig