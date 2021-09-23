import { FastifyServerOptions } from 'fastify';

type GlobalConfig = {
    server: {
        port: number;
    };
    fastifyOptions: FastifyServerOptions;
    separateServices: {
        /**
         *
         */
        etherscan: {
            rootEndpoint: URL;
            cacheTime: number;
        };
    };
};

export default GlobalConfig;
