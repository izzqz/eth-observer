import got from 'got';
import { mocked } from 'ts-jest/utils';

import EtherscanService from './etherscan';

jest.mock('got');

describe('EtherscanService', () => {
    const REQUEST_RATE = 200;

    const mockedGot = mocked(got);
    let etherscanService: EtherscanService;
    let response: object;

    beforeEach(() => {
        etherscanService = new EtherscanService(
            new URL('blob://localhost'),
            REQUEST_RATE
        );

        expect(jest.isMockFunction(got)).toBeTruthy();

        mockedGot.mockReturnValue({
            json: () => Promise.resolve(response)
        } as any);
    });

    afterEach(jest.clearAllMocks);

    it('should be defined', () => {
        expect(EtherscanService).toBeDefined();
    });

    describe('getLastBlockNumber', () => {
        beforeEach(() => {
            response = {
                jsonrpc: '2.0',
                id: 83,
                result: '0xc36b29'
            };
        });

        it('should be defined', () => {
            expect(etherscanService.getLastBlockNumber).toBeDefined();
        });

        it('should return last block number', async () => {
            expect(await etherscanService.getLastBlockNumber()).toMatchObject(
                response
            );
        });
    });

    describe('getBlockByNumber', () => {
        beforeEach(() => {
            response = {
                jsonrpc: '2.0',
                id: 1,
                result: {
                    baseFeePerGas: '0x5cfe76044',
                    difficulty: '0x1b4ac252b8a531',
                    extraData:
                        '0xd883010a06846765746888676f312e31362e36856c696e7578',
                    gasLimit: '0x1caa87b',
                    gasUsed: '0x5f036a',
                    hash: '0x396288e0ad6690159d56b5502a172d54baea649698b4d7af2393cf5d98bf1bb3',
                    logsBloom:
                        '0x5020418e211832c600000411c00098852850124700800500580d406984009104010420410c00420080414b044000012202448082084560844400d00002202b1209122000812091288804302910a246e25380282000e00002c00050009038cc205a018180028225218760100040820ac12302840050180448420420b000080000410448288400e0a2c2402050004024a240200415016c105844214060005009820302001420402003200452808508401014690208808409000033264a1b0d200c1200020280000cc0220090a8000801c00b0100a1040a8110420111870000250a22dc210a1a2002409c54140800c9804304b408053112804062088bd700900120',
                    miner: '0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',
                    mixHash:
                        '0xc547c797fb85c788ecfd4f5d24651bddf15805acbaad2c74b96b0b2a2317e66c',
                    nonce: '0x04a99df972bd8412',
                    number: '0xc63251',
                    parentHash:
                        '0xbb2d43395f93dab5c424421be22d874f8c677e3f466dc993c218fa2cd90ef120',
                    receiptsRoot:
                        '0x3de3b59d208e0fd441b6a2b3b1c814a2929f5a2d3016716465d320b4d48cc1e5',
                    sha3Uncles:
                        '0xee2e81479a983dd3d583ab89ec7098f809f74485e3849afb58c2ea8e64dd0930',
                    size: '0x6cb6',
                    stateRoot:
                        '0x60fdb78b92f0e621049e0aed52957971e226a11337f633856d8b953a56399510',
                    timestamp: '0x6110bab2',
                    totalDifficulty: '0x612789b0aba90e580f8',
                    transactions: [
                        '0x40330c87750aa1ba1908a787b9a42d0828e53d73100ef61ae8a4d925329587b5',
                        '0x6fa2208790f1154b81fc805dd7565679d8a8cc26112812ba1767e1af44c35dd4',
                        '0xe31d8a1f28d4ba5a794e877d65f83032e3393809686f53fa805383ab5c2d3a3c',
                        '0xa6a83df3ca7b01c5138ec05be48ff52c7293ba60c839daa55613f6f1c41fdace',
                        '0x4e46edeb68a62dde4ed081fae5efffc1fb5f84957b5b3b558cdf2aa5c2621e17',
                        '0x356ee444241ae2bb4ce9f77cdbf98cda9ffd6da244217f55465716300c425e82',
                        '0x1a4ec2019a3f8b1934069fceff431e1370dcc13f7b2561fe0550cc50ab5f4bbc',
                        '0xad7994bc966aed17be5d0b6252babef3f56e0b3f35833e9ac414b45ed80dac93'
                    ],
                    transactionsRoot:
                        '0xaceb14fcf363e67d6cdcec0d7808091b764b4428f5fd7e25fb18d222898ef779',
                    uncles: [
                        '0x9e8622c7bf742bdeaf96c700c07151c1203edaf17a38ea8315b658c2e6d873cd'
                    ]
                }
            };
        });

        it('should be defined', () => {
            expect(etherscanService.getBlockByNumber).toBeDefined();
        });

        it('should return block info', async () => {
            expect(
                await etherscanService.getBlockByNumber('0x10d4f')
            ).toMatchObject(response);
        });
    });

    describe('request rate', () => {
        it('should be used', async () => {
            const until = Date.now() + REQUEST_RATE;

            while (until > Date.now()) {
                await etherscanService.getLastBlockNumber(); // 2
            }

            await etherscanService.getLastBlockNumber(); // 3

            expect(mockedGot.mock.calls.length).toBe(3);
        });
    });
});
