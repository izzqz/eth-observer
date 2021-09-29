import got from 'got';

import {
    BlockInfoDto,
    BlockNumberDto
} from '../../interfaces/etherscan/etherscan.dto';
import { IEtherscan } from '../../interfaces/etherscan/etherscan.interface';

/**
 * Library for communicating with the Etherscan API
 */
export default class EtherscanService implements IEtherscan {
    /**
     * UNIX Time of last api request
     */
    lastRequestTime: number;

    private timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private commitRequestTime() {
        this.lastRequestTime = Date.now();
    }

    /**
     * Fetching library
     */
    private async fetcher(url: string): Promise<object> {
        this.commitRequestTime();
        let data;

        try {
            data = await got(url).json();
        } catch (err) {
            throw new Error(err);
        }

        // TODO: EtherscanError handler
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data;
    }

    constructor(
        public rootEndpoint: URL,
        public requestRate: number,
        public apiKey?: string
    ) {}

    private async fetch(params: URLSearchParams): Promise<any> {
        if (this.apiKey) {
            params.append('apikey', this.apiKey);
        }

        const endpoint = new URL(
            '?' + params.toString(),
            this.rootEndpoint
        ).toString();

        const isExceedsTheRate =
            this.lastRequestTime + this.requestRate > Date.now();

        if (isExceedsTheRate) {
            const awaitTime =
                this.lastRequestTime + this.requestRate - Date.now();
            await this.timeout(awaitTime);
        }

        return await this.fetcher(endpoint);
    }

    /**
     * Returns the number of most recent block
     * @see https://docs.etherscan.io/api-endpoints/geth-parity-proxy#eth_blocknumber
     */
    async getLastBlockNumber(): Promise<BlockNumberDto> {
        const queryParams = new URLSearchParams(
            'module=proxy&action=eth_blockNumber'
        );

        return await this.fetch(queryParams);
    }

    /**
     * Returns information about a block by block number
     * @param tag {string} Hexadecimal in string. Example: '0x10d4f'
     * @see https://docs.etherscan.io/api-endpoints/geth-parity-proxy#eth_getblockbynumber
     */
    async getBlockByNumber(tag: string): Promise<BlockInfoDto> {
        const queryParams = new URLSearchParams(
            'module=proxy&action=eth_getBlockByNumber&boolean=true'
        );

        queryParams.append('tag', tag);

        return await this.fetch(queryParams);
    }
}
