const crypto = require('crypto');

class BlockchainScenario {
    #MAX_TRANSACTIONS = 1;
    #WALLETS_COUNT = 3;

    util = {
        parseUint256: (hex) => parseInt(hex, 16) / Math.pow(10, 18),
        intToUint256: (number) => (number * Math.pow(10, 18)).toString(16),
        toHex: (number) => '0x' + number.toString(16)
    };

    addresses = [];

    constructor(chainSize, expectFromLength) {
        this.#generateAdresses();
        this.chain = this.#generateChain(chainSize);
        this.expected = this.#getExpected(expectFromLength);
    }

    #generateChain(size) {
        return new Array(size).fill(undefined).map((b, index) => {
            return {
                jsonrpc: '2.0',
                id: 1,
                result: {
                    baseFeePerGas: '0x0',
                    difficulty: '0x0',
                    extraData: '0x0',
                    gasLimit: '0x0',
                    gasUsed: '0x0',
                    hash: '0x0',
                    logsBloom: '0x0',
                    miner: '0x0',
                    mixHash: '0x0',
                    nonce: '0x0',
                    number: this.util.toHex(index),
                    parentHash: '0x0',
                    receiptsRoot: '0x0',
                    sha3Uncles: '0x0',
                    size: '0x0',
                    stateRoot: '0x0',
                    timestamp: '0x0',
                    totalDifficulty: '0x0',
                    transactions: this.#generateTransactions(
                        this.#MAX_TRANSACTIONS
                    ), // MAX
                    transactionsRoot: '0x0',
                    uncles: ['0x0']
                }
            };
        });
    }

    #generateTransactions(max) {
        const arr = new Array(Math.floor(max + Math.random())).fill(undefined);

        return arr.map(() => {
            const from = this.#getRandomAddress();
            const value = Math.random();
            const transaction = {
                from,
                value,
                to: this.#getRandomAddress(from)
            };

            return {
                accessList: [],
                blockHash: '0x0',
                blockNumber: '0x0',
                chainId: '0x0',
                from: transaction.from,
                gas: '0x0',
                gasPrice: '0x0',
                hash: '0x0',
                input: '0x0',
                maxFeePerGas: '0x0',
                maxPriorityFeePerGas: '0x0',
                nonce: '0x0',
                r: '0x0',
                s: '0x0',
                to: transaction.to,
                transactionIndex: '0x0',
                type: '0x0',
                v: '0x0',
                value: '0x' + this.util.intToUint256(transaction.value)
            };
        });
    }

    #generateAdresses() {
        for (let i = 0; i < this.#WALLETS_COUNT; i++) {
            const address = '0x' + crypto.randomBytes(30).toString('hex');
            this.addresses.push(address);
        }
    }

    #getRandomAddress(except) {
        let addresses = this.addresses;
        if (except) {
            addresses = addresses.filter((a) => a !== except);
        }

        return addresses[Math.floor(addresses.length * Math.random())];
    }

    #getExpected(length) {
        const chainSlice = this.chain.slice(length);

        let wallets = this.addresses.map((a) => ({
            address: a,
            value: 0
        }));

        const applyTransaction = (t) => {
            const { parseUint256 } = this.util;

            wallets = wallets.map((w) => {
                if (w.address === t.to) {
                    return {
                        address: w.address,
                        value: w.value + parseUint256(t.value)
                    };
                }
                if (w.address === t.from) {
                    return {
                        address: w.address,
                        value: w.value - parseUint256(t.value)
                    };
                }

                return w; // else nothing to apply
            });
        };

        chainSlice.forEach((block) =>
            block.result.transactions.forEach(applyTransaction)
        );

        let largest = {
            value: 0
        };

        for (let i = 0; i < wallets.length; i++) {
            if (largest.value < wallets[i].value) {
                largest = wallets[i];
            }
        }

        return largest.address;
    }
}

module.exports = BlockchainScenario;
