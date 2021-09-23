import got from 'got';

import { BlockInfoDto, BlockNumberDto } from './etherscanResponce.dto';

/**
 *
 */
export default class EtherscanService {
    private cache: Map<
        string, // endpoint
        {
            /**
             * Allready parsed body response
             */
            data: object;

            /**
             * Unix time
             */
            validUntil: number;
        }
    >;

    /**
     * Fetching library
     */
    private async fetcher(url: string): Promise<object> {
        return await got(url).json();
    }

    constructor(public rootEndpoint: URL, public cacheTime: number) {
        this.cache = new Map();
    }

    private async fetch(params: URLSearchParams): Promise<any> {
        const endpoint = new URL(
            params.toString(),
            this.rootEndpoint
        ).toString();

        if (this.cache.has(endpoint)) {
            const cachedRequest = this.cache.get(endpoint);
            const isCacheValid = cachedRequest.validUntil > Date.now();

            if (isCacheValid) {
                return cachedRequest.data;
            }

            if (!isCacheValid) {
                this.cache.delete(endpoint);
            }
        }

        const data = await this.fetcher(endpoint).catch((err) => {
            throw err;
        });

        this.cache.set(endpoint, {
            data,
            validUntil: Date.now() + this.cacheTime
        });

        return data;
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
