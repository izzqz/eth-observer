import { FastifyServerOptions } from 'fastify';

require('dotenv').config();

const config = {
    server: {
        port: 8080
    },
    fastifyOptions: {
        logger: {
            prettyPrint: true
        }
    } as FastifyServerOptions,
    separateServices: {
        etherscan: {
            apiKey: process.env.ETHERSCAN_APIKEY,
            rootEndpoint: 'https://api.etherscan.io/api',
            cacheTime: 5000
        }
    },
    bufferSize: 10
};

export default config;
