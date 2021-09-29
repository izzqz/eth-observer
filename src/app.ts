import ObserverService from './services/observerService/observerService';
import runSynchronizerWorker from './services/synchronizerWorker/synchronizerWorker';
import fastify from 'fastify';
import config from './config/config';

const server = fastify(config.fastifyOptions);

const worker = runSynchronizerWorker({
    workerData: {
        etherscanConfiguration: config.separateServices.etherscan,
        bufferSize: config.bufferSize
    }
});

worker.on('message', (msg) => {
    if (msg.event === 'ready') {
        runServer();
    }

    if (msg.event === 'log') {
        server.log.info(msg.value)
    }

    if (
        msg.event === 'new-transactions' &&
        observerService.mostValuableAdress
    ) {
        server.log.info(`Block handled, ${msg.value.length} new transactions`);
    }
});

worker.onerror = (err) => {
    throw err;
};

const observerService = new ObserverService(worker, config.bufferSize);

server.get(
    '/mostValuableAddress',
    async () => observerService.mostValuableAdress
);

function runServer() {
    server.listen(config.server.port, (err, address) => {
        if (err) {
            server.log.error(err.message);
            process.exit(1);
        }

        server.log.info(
            `Running with ${config.separateServices.etherscan.apiKey} apikey`
        );
    });
}
