import fastify from 'fastify';
import config from './config/config';

const server = fastify(config.fastifyOptions);

server.get('/ping', async () => 'pong\n');

server.listen(config.server.port, (err, address) => {
    if (err) {
        server.log.error(err.message);
        process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
});
