import got from 'got';
import { mocked } from 'ts-jest/utils';

import EtherscanService from './etherscanService';

jest.mock('got');

describe('EtherService', () => {
    const CACHE_TIMEOUT = 1000;

    const mockedGot = mocked(got);
    let etherscanService: EtherscanService;
    let response: object;

    it('should be defined', () => {
        expect(EtherscanService).toBeDefined();
    });

    describe('getLastBlockNumber', () => {
        beforeEach(() => {
            etherscanService = new EtherscanService(
                new URL('blob://localhost'),
                CACHE_TIMEOUT
            );

            response = {
                jsonrpc: '2.0',
                id: 83,
                result: '0xc36b29'
            };

            expect(jest.isMockFunction(got)).toBeTruthy();

            mockedGot.mockReturnValue({
                json: () => Promise.resolve(response)
            } as any);
        });

        it('should be defined', () => {
            expect(etherscanService.getLastBlockNumber).toBeDefined();
        });

        it('should use cache', async () => {
            for (let i = 0; i < 100; i++) {
                expect(
                    await etherscanService.getLastBlockNumber()
                ).toMatchObject(response);
            }

            expect(mockedGot.mock.calls.length).toBe(1);
        });

        it(
            'should clear cache after timeout',
            async () => {
                function timeout(ms) {
                    return new Promise((resolve) => setTimeout(resolve, ms));
                }

                async function makeRequest() {
                    expect(
                        await etherscanService.getLastBlockNumber()
                    ).toMatchObject(response);
                }

                const runUntil = Date.now() + CACHE_TIMEOUT;

                while (Date.now() < runUntil) {
                    await makeRequest();
                }
                await timeout(100);

                await makeRequest();

                await timeout(CACHE_TIMEOUT + 10);

                await makeRequest();

                expect(mockedGot.mock.calls.length).toBe(4);
            },
            CACHE_TIMEOUT * 5
        );

        it('should return last block number', async () => {
            expect(await etherscanService.getLastBlockNumber()).toMatchObject(
                response
            );
        });
    });
});
