import { EventEmitter } from 'events';
import ObserverService from './observerService';

const BUFFER_SIZE = 100;

const mockedSynchronizer = new EventEmitter();
jest.spyOn(mockedSynchronizer, 'on');

describe('ObserverService', () => {
    let observerService: ObserverService;

    it('should be defined', () => {
        expect(ObserverService).toBeDefined();
    });

    beforeEach(() => {
        // @ts-expect-error
        observerService = new ObserverService(mockedSynchronizer, BUFFER_SIZE);
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
});
