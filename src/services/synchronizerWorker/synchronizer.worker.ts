import { isMainThread, parentPort, workerData } from 'worker_threads';

import { IEtherscan } from '../../interfaces/etherscan/etherscan.interface';
import { transaction } from '../../interfaces/transaction.type';
import EtherscanService from '../../lib/etherscan/etherscan';
import hexUtil from '../../utils/hexUtil';

if (isMainThread) {
    throw new Error('Cannot run as main tread');
}

const { rootEndpoint, requestRate, apiKey } = workerData.etherscanConfiguration;
const bufferSize = workerData.bufferSize;

const etherScan: IEtherscan = new EtherscanService(
    rootEndpoint,
    requestRate,
    apiKey
);

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper around ehterScan. Returns only transactions.
 */
async function getTransactionsOf(blockNumber): Promise<transaction[]> {
    return await etherScan.getBlockByNumber(blockNumber).then((d) => {
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

    const transactionsBuffer: Array<transaction[]> = [];

    // First run
    while (transactionsBuffer.length < bufferSize) {
        lastblock = await etherScan.getLastBlockNumber().then((d) => d.result);

        if (lastblock === bufferEndblock) {
            bufferStartblock = hexUtil.decrease(
                bufferStartblock || bufferEndblock // if its first request, bufferStartblock is undefined
            );

            blockTransactions = await getTransactionsOf(bufferStartblock);

            transactionsBuffer.unshift(blockTransactions); // Add to the beginning of a buffer
        }

        if (lastblock !== bufferEndblock) {
            bufferEndblock = lastblock;

            blockTransactions = await getTransactionsOf(bufferEndblock);

            transactionsBuffer.push(blockTransactions); // Add to the end
        }

        parentPort.postMessage({
            event: 'log',
            value: `Filling the buffer ${transactionsBuffer.length}/${bufferSize} completed`
        });
    }

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
    const lastTreeBlocks: string[] = new Array(3).fill('');
    
    // Synchronizer loop
    while (true) {
        try {
            fetched = await etherScan
                .getLastBlockNumber()
                .then((d) => d.result);

            if (!lastTreeBlocks.includes(fetched)) {
                lastTreeBlocks.shift();
                lastTreeBlocks.push(fetched);

                lastblock = lastTreeBlocks[2];

                blockTransactions = await getTransactionsOf(lastblock);

                parentPort.postMessage({
                    event: 'new-transactions',
                    value: blockTransactions
                });

                parentPort.postMessage({
                    event: 'log',
                    value: `Block ${lastblock} handled, ${blockTransactions.length} new transactions`
                });
            }

            await timeout(requestRate);
        } catch (err) {
            throw err;
        }
    }
})();
