import { FastifyServerOptions } from 'fastify';
import { config as applyEnvFile } from 'dotenv';

applyEnvFile();

const config = {
    server: {
        port: 8080
    },
    fastifyOptions: {
        logger: {
            prettyPrint: true
        }
    } as FastifyServerOptions,
    etherscan: {
        apiKey: process.env.ETHERSCAN_APIKEY,

        rootEndpoint: 'https://api.etherscan.io/api',

        /**
         * Based on free api plan its
         * 5 calls/second limit
         * And up to 100,000 API calls per day
         *
         * @see https://etherscan.io/apis
         */
        requestRate: 200
    },
    bufferSize: 100
};

export default config;
