require("dotenv").config();

let appConfig={};

appConfig.port=process.env.API_PORT;
appConfig.allowedCorsOrigin="*";
appConfig.env=process.env.ENVIRONMENT;
appConfig.db={
    uri:process.env.DBURI
};


appConfig.apiVersion=process.env.API_VERSION;

module.exports={
    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    environment:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
}