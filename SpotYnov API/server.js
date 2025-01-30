const app = require('./app');
const log = require('./logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT} !`)
    console.log("----")
    console.log(`Link : http://localhost:${PORT}`)
    // TODO : Swagger
    // console.log("Documentation : http://localhost:3000/api-docs")
    // console.log("----\n")

    log.info(`Server is running on port ${PORT}`);
});