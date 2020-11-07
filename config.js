/* Create and export configuration variables */

//Container for environments

var environments = {};

//Staging objects that are the environments

environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 30001,
    'envName' : 'staging'
};

environments.production = {
    'httpPort' : 80,
    'httpsPort' : 443,
    'envName' : 'production'
}


// Check the environment 
var currentEnvironment  = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//If the environment is empty, we will let the staging environment

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Exporting the current environment

module.exports = environmentToExport;