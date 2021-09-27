import { FastifyServerOptions } from 'fastify';

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
            rootEndpoint: new URL('https://api.etherscan.io/api'),
            cacheTime: 5000
        }
    }
};

export default config;
