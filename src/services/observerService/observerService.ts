import ISynchronizer, {
    SynchronizerMessage
} from '../../interfaces/synchronizer.interface';
import { transaction } from '../../interfaces/transaction.type';

export default class ObserverService {
    private lastBlocks: Array<transaction[]>;

    mostValuableAdress: string;

    constructor(
        private synchronizer: ISynchronizer,
        private bufferSize: number
    ) {
        this.lastBlocks = new Array(this.bufferSize).fill(null);
        this.synchronizer.on('message', this.newMessageHandler.bind(this));
    }

    private newMessageHandler(msg: SynchronizerMessage) {
        if (msg.event === 'new-transactions') {
            this.addTransactionsToBuffer(msg.value);
            
            if (this.lastBlocks.includes(null)) return;

            this.recalculateMostValueble();
        }
    }

    private addTransactionsToBuffer(transactions: transaction[]) {
        this.lastBlocks.shift();
        this.lastBlocks.push(transactions);
    }

    recalculateMostValueble() {
        // Map<address, value>
        const wallets: Map<string, number> = new Map();

        const allTransactions = this.lastBlocks.flat();

        allTransactions.forEach((t) => {
            if (t === null) return;

            if (!wallets.has(t.from)) {
                wallets.set(t.from, 0);
            }
            if (!wallets.has(t.to)) {
                wallets.set(t.to, 0);
            }

            wallets.set(t.from, wallets.get(t.from) - t.value);
            wallets.set(t.to, wallets.get(t.to) + t.value);
        });

        /**
         * Finding highest value in Map
         * @see https://stackoverflow.com/a/51690218/12889642
         */
        const [address, value] = [...wallets.entries()].reduce((a, e) => {
            return e[1] > a[1] ? e : a;
        });

        this.mostValuableAdress = address;
        return address;
    }
}
