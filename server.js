const app = require('./app')
const appConfig=require('./config/appConfig');
const port = appConfig.port;

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

