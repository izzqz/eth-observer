import got from 'got';

import { getLastBlockNumber } from './etherscanResponce.dto';

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
            data: unknown;

            /**
             * Unix time
             */
            validUntil: number;
        }
    >;

    /**
     * Fetching library. Encapsulated for mock/proxy purposes.
     */
    private async fetcher(url: string): Promise<object> {
        return await got(url).json();
    }

    constructor(public rootEndpoint: URL, public cacheTime: number) {
        this.cache = new Map();
    }

    private async fetch(url: URL): Promise<any> {
        const endpoint = url.toString();

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
    async getLastBlockNumber(): Promise<getLastBlockNumber> {
        const queryParams = new URLSearchParams(
            'module=proxy&action=eth_blockNumber'
        );
        const endpoint = new URL(queryParams.toString(), this.rootEndpoint);

        return await this.fetch(endpoint);
    }
}
