const debug = require('@tryghost/debug')('web:endpoints:admin:app');
const boolParser = require('express-query-boolean');
const bodyParser = require('body-parser');
const errorHandler = require('@tryghost/mw-error-handler');
const versionMatch = require('@tryghost/mw-version-match');

const shared = require('../../../shared');
const express = require('../../../../../shared/express');
const sentry = require('../../../../../shared/sentry');
const routes = require('./routes');
const APIVersionCompatibilityService = require('../../../../services/api-version-compatibility');
const GhostNestApp = require('@tryghost/app');

module.exports = function setupApiApp() {
    debug('Admin API setup start');
    const apiApp = express('admin api');

    // API middleware

    // Body parsing
    apiApp.use(bodyParser.json({limit: '50mb'}));
    apiApp.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

    // Query parsing
    apiApp.use(boolParser());

    // Check version matches for API requests, depends on res.locals.safeVersion being set
    // Therefore must come after themeHandler.ghostLocals, for now
    apiApp.use(versionMatch);

    // Admin API shouldn't be cached
    apiApp.use(shared.middleware.cacheControl('private'));

    // Routing
    apiApp.use(routes());

    const nestAppPromise = GhostNestApp.create().then((nestApp) => {
        nestApp.init();
        return nestApp;
    });

    apiApp.use(async (req, res, next) => {
        const nestApp = await nestAppPromise;
        nestApp.getHttpAdapter().getInstance()(req, res, next);
    });

    // API error handling
    apiApp.use(errorHandler.resourceNotFound);
    apiApp.use(APIVersionCompatibilityService.errorHandler);
    apiApp.use(errorHandler.handleJSONResponse(sentry));

    debug('Admin API setup end');

    return apiApp;
};
