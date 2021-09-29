import ObserverService from './services/observerService/observerService';
import runSynchronizerWorker from './services/synchronizerWorker/synchronizerWorker';
import fastify from 'fastify';
import config from './config/config';

const server = fastify(config.fastifyOptions);

if (config.etherscan.apiKey) {
    server.log.debug(`ETHERSCAN_APIKEY=${config.etherscan.apiKey}`);
} else {
    server.log.error('Cannot run without Ethercan API key')
    process.exit(1);
}

server.log.info('Starting worker...');

const worker = runSynchronizerWorker({
    workerData: {
        etherscanConfiguration: config.etherscan,
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
    });
}

process.on('SIGINT', () => {
    server.log.warn('SIGINT recieved, closing worker...');
    worker.terminate();
    process.exit();
});

process.on('uncaughtException', (err) => {
    worker.terminate();
    server.log.fatal('UncaughtException:');
    server.log.fatal(err.name, err.message);
    server.log.debug(err.stack);
    process.exit(1);
});
