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
        server.log.info(msg.value);
    }
});

worker.onerror = (err) => {
    // TODO: Worker error handler
    server.log.fatal('Uncaught error:', err.message);
    process.exit(1);
};

const observerService = new ObserverService(worker, config.bufferSize);

server.get('/mostValuableAddress', async () => {
    return observerService.mostValuableWallet;
});

function runServer() {
    server.listen(config.server.port, (err) => {
        if (err) {
            server.log.fatal(err.message);
            process.exit(1);
        }

        server.log.info(
            `Running with ${config.separateServices.etherscan.apiKey} apikey`
        );
    });
}
