import { isMainThread, parentPort, workerData } from 'worker_threads';

import { IEtherscan } from '../../interfaces/etherscan/etherscan.interface';
import { transaction } from '../../interfaces/transaction.type';
import EtherscanService from './etherscanService/etherscanService';
import hexUtil from '../../utils/hexUtil';

if (isMainThread) {
    throw new Error('Cannot run as main tread');
}

const SYNC_TYMEOUT = 500;

const { rootEndpoint, cacheTime, apiKey } = workerData.etherscanConfiguration;
const bufferSize = workerData.bufferSize;

const etherScan: IEtherscan = new EtherscanService(
    rootEndpoint,
    cacheTime,
    apiKey
);

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper around ehterScan. Returns only transactions.
 * @param number Block number
 */
async function getTransactionsOf(number): Promise<transaction[]> {
    return await etherScan.getBlockByNumber(number).then((d) => {
        return d.result.transactions.map((t) => {
            return {
                from: t.from,
                to: t.to,
                value: hexUtil.uint256toFloat(t.value)
            } as transaction;
        });
    });
}

(async function mainLoop() {
    /**
     * Block id when buffer ends. Most of all the end of blockchain.
     */
    let bufferEndblock: string;

    /**
     * Block id when blockchain ends
     */
    let lastblock: string;

    /**
     * Block id when buffer starts
     */
    let bufferStartblock: string;

    let blockTransactions: transaction[];

    const transactionsBuffer: Array<transaction[]> = new Array();

    // First run
    do {
        lastblock = await etherScan.getLastBlockNumber().then((d) => d.result);

        if (lastblock !== bufferEndblock) {
            bufferEndblock = lastblock;

            blockTransactions = await getTransactionsOf(bufferEndblock);

            transactionsBuffer.push(blockTransactions); // Add to the end
        }

        if (lastblock === bufferEndblock) {
            bufferStartblock = hexUtil.decrease(
                bufferStartblock || bufferEndblock // if its first request, bufferStartblock is undefined
            );

            blockTransactions = await getTransactionsOf(bufferStartblock);

            transactionsBuffer.unshift(blockTransactions); // Add to the beginning of a buffer
        }

        parentPort.postMessage({
            event: 'log',
            value: `Filling the buffer ${transactionsBuffer.length}/${bufferSize} completed`
        });
    } while (transactionsBuffer.length !== bufferSize);

    transactionsBuffer.forEach((transactions) =>
        parentPort.postMessage({
            event: 'new-transactions',
            value: transactions
        })
    );

    parentPort.postMessage({
        event: 'log',
        value: `Buffer full, starting synchronizer loop...`
    });

    parentPort.postMessage({
        event: 'ready',
        value: null
    });

    let fetched: string;

    // Synchronizer loop
    while (true) {
        try {
            fetched = await etherScan
                .getLastBlockNumber()
                .then((d) => d.result);

            if (lastblock !== fetched) {
                lastblock = fetched;

                blockTransactions = await getTransactionsOf(lastblock);

                parentPort.postMessage({
                    event: 'new-transactions',
                    value: blockTransactions
                });

                parentPort.postMessage({
                    event: 'log',
                    value: `Block handled, ${blockTransactions.length} new transactions`
                });
            }

            await timeout(SYNC_TYMEOUT);
        } catch (err) {
            throw err;
        }
    }
})();
