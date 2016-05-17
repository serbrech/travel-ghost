// # Ghost Configuration for Azure Deployment
// Setup your Ghost install for various environments
// Documentation can be found at http://support.ghost.org/config/

var path = require('path'),
    websiteUrl = process.env.websiteUrl,
    websiteUrlSSL = process.env.websiteUrlSSL,
    config;

// Azure Feature
// ------------------------------------------------------------------------
// If the App Setting 'websiteUrl' is set, Ghost will use that URL as base.
// If it isn't set, we'll go with the default sitename.
if (!websiteUrl || websiteUrl === '' ||  websiteUrl.length === 0) {
    websiteUrl = 'http://' + process.env.siteName;
    console.log(websiteUrl);
}

if (!websiteUrlSSL || websiteUrlSSL === '' ||  websiteUrlSSL.length === 0) {
    //in prod mode - forceSSL is true - so we can use the azure issued cert
    // web apps supply some default env variables - WEBSITE_SITE_NAME and WEBSITE_HOSTNAME
    // represent the siteName and the full DNS name respectively.
    // using the WEBSITE_HOSTNAME we don't have to append anything and would work in ASE too.
    websiteUrlSSL = 'https://' + process.env.WEBSITE_HOSTNAME;
    console.log(websiteUrlSSL);
}

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: websiteUrl,
        urlSSL: websiteUrlSSL,

        // Visit http://support.ghost.org/mail for instructions
        mail: {
         transport: 'SMTP',
         options: {
             service: process.env.emailService,
             auth: {
                 user: process.env.emailUsername, // mailgun username
                 pass: process.env.emailPassword  // mailgun password
             }
         }
        },
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost.db')
            },
            debug: false
        },
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: process.env.PORT
        },
        // storage: {
        //     active: 'ghost-azurestorage',
        //     'ghost-azurestorage': {
        //         connectionString: process.env.BlogStorageConnectionString,
        //         container: 'travel'//,
        //         //cdnUrl: "YourCDNEndpointDomain",
        //         // useHttps : "UseHttpsInEndpoint" //Optional: CDN protocol. Defaults to http if omitted. Set to "true", to enable.
        //     }
        // },
        forceAdminSSL: true
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: websiteUrl + ':1337',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-test.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '1337'
        },
        storage: {
            active: 'ghost-azurestorage',
            'ghost-azurestorage': {
                connectionString: process.env.MS_AzureStorageAccountConnectionString,
                container: 'travel'//,
                //cdnUrl: "YourCDNEndpointDomain",
                // useHttps : "UseHttpsInEndpoint" //Optional: CDN protocol. Defaults to http if omitted. Set to "true", to enable.
            }
        },
        logging: true
    }
};

// Export config
module.exports = config;
