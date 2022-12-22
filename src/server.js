const app = require('./app');

init();

async function init() {
  const port = process.env.PORT || 3001;
  try {
    app.listen(port, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
