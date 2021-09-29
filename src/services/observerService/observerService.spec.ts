import { transaction } from '../../interfaces/transaction.type';
import BlockchainScenario from '../../../test/etherscanScenarioGenerator';
import hexUtil from '../../utils/hexUtil';
import { EventEmitter } from 'events';
import ObserverService from './observerService';

const BUFFER_SIZE = 100;

const mockedSynchronizer = new EventEmitter();
jest.spyOn(mockedSynchronizer, 'on');

let scenario: BlockchainScenario;

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('ObserverService', () => {
    let observerService: ObserverService;

    it('should be defined', () => {
        expect(ObserverService).toBeDefined();
    });

    beforeEach(() => {
        // @ts-expect-error
        observerService = new ObserverService(mockedSynchronizer, BUFFER_SIZE);
        scenario = new BlockchainScenario(BUFFER_SIZE * 2, BUFFER_SIZE);

        scenario.chain
            .map((b) => b.result.transactions)
            .flat()
            .map((t) => {
                return {
                    from: t.from,
                    to: t.to,
                    value: hexUtil.uint256toFloat(t.value)
                } as transaction;
            })
            .forEach((t) => {
                return mockedSynchronizer.emit('message', {
                    event: 'new-transactions',
                    value: t
                });
            });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should subscribe for new transactions', () => {
        expect(mockedSynchronizer.on).toBeCalledWith(
            'message',
            expect.any(Function)
        );
    });

    it('should count most valuable address', () => {
        expect(observerService.mostValuableWallet).toBe(
            scenario.getMostValuableAdress()
        );
    });
});
