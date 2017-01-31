var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
        service: 'postmark',
        APN: false,
        email: false, // true
        actions: ['comment'],
        tplPath: templatePath,
        key: 'POSTMARK_KEY',
        parseAppId: 'PARSE_APP_ID',
        parseApiKey: 'PARSE_MASTER_KEY'
    }

function createDbConnectionString(host, dbname) {
    return "mongodb://" + process.env.db_user + ":" + process.env.db_password + "@" + host + "/" + dbname;
}

var options = {
    debug: {
        name: 'debug',
        db: createDbConnectionString("ds131729.mlab.com:31729", "simplecrm"),
        root: rootPath,
        notifier: notifier,
		secret: 'ebb65a09-0f30-41db-b9ad-9a199a0db862',
        viewPath: 'views',
        app: {
            name: 'Simple CRM'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        twitter: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        linkedin: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/linkedin/callback"
        }
    },
    test: {
        name: 'test',
        db: createDbConnectionString("ds131729.mlab.com:31729", "simplecrm"),
        root: rootPath,
        notifier: notifier,
        viewPath: 'views',
		secret: 'ebb65a09-0f30-41db-b9ad-9a199a0db862',
        app: {
            name: 'Simple CRM'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        twitter: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        linkedin: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/linkedin/callback"
        }
    },
    release: {
        name: 'release',
        db: createDbConnectionString("ds131729.mlab.com:31729", "simplecrm"),
        root: rootPath,
        notifier: notifier,
        viewPath: '../views',
		secret: 'ebb65a09-0f30-41db-b9ad-9a199a0db862',
        app: {
            name: 'Simple CRM'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        twitter: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        linkedin: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/linkedin/callback"
        }
    }
}

var env = process.env['env'] || "debug";
env = env.toLowerCase();

console.log("env: " + env)
if (env == 'debug')
    module.exports = options['debug'];
else if (env == 'release')
    module.exports = options['release'];
else if (env == 'test')
    module.exports = options['test'];
