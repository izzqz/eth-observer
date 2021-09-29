import { transaction } from './transaction.type';

export type SynchronizerMessage =
    | {
          event: 'ready';
          value: null;
      }
    | {
          event: 'new-transactions';
          value: transaction[];
      }
    | {
          event: 'log';
          value: string;
      };

export default interface ISynchronizer extends Worker {
    on(event: 'message', listener: (msg: SynchronizerMessage) => void): this;
}
