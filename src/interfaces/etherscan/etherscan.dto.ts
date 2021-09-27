type hexadecimal = string;

type rawTransation = {
    blockHash: hexadecimal;
    blockNumber: hexadecimal;
    from: hexadecimal;
    gas: hexadecimal;
    gasPrice: hexadecimal;
    hash: hexadecimal;
    input: hexadecimal;
    nonce: hexadecimal;
    r: hexadecimal;
    s: hexadecimal;
    to: hexadecimal;
    transactionIndex: hexadecimal;
    type: hexadecimal;
    v: hexadecimal;
    value: hexadecimal;
};

/**
 * @see https://docs.etherscan.io/api-endpoints/geth-parity-proxy#eth_blocknumber
 */
export type BlockNumberDto = {
    jsonrpc: number;
    id: number;
    result: hexadecimal;
};

/**
 * @see https://docs.etherscan.io/api-endpoints/geth-parity-proxy#eth_getblockbynumber
 */
export type BlockInfoDto = {
    jsonrpc: number;
    id: number;
    result: {
        baseFeePerGas: hexadecimal;
        difficulty: hexadecimal;
        extraData: hexadecimal;
        gasLimit: hexadecimal;
        gasUsed: hexadecimal;
        hash: hexadecimal;
        logsBloom: hexadecimal;
        miner: hexadecimal;
        mixHash: hexadecimal;
        nonce: hexadecimal;
        number: hexadecimal;
        parentHash: hexadecimal;
        receiptsRoot: hexadecimal;
        sha3Uncles: hexadecimal;
        size: hexadecimal;
        stateRoot: hexadecimal;
        timestamp: hexadecimal;
        totalDifficulty: hexadecimal;
        transactions: rawTransation[];
        transactionsRoot: hexadecimal;
        uncles: hexadecimal[];
    };
};
