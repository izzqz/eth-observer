type hexadecimal = string;

/**
 * @see https://docs.etherscan.io/api-endpoints/geth-parity-proxy#eth_blocknumber
 */
export type getLastBlockNumber = {
    jsonrpc: number;
    id: number;
    result: hexadecimal;
};
