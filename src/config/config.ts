import GlobalConfig from './type';

const config: GlobalConfig = {
    server: {
        port: 8080
    },
    fastifyOptions: {
        logger: {
            prettyPrint: true
        }
    },
    separateServices: {
        etherscan: {
            rootEndpoint: new URL('https://api.etherscan.io/api'),
            cacheTime: 5000
        }
    }
};

export default config;
