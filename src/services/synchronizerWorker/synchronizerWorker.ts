import ISynchronizer from '../../interfaces/synchronizer.interface';
import { join } from 'path';
import { WorkerOptions, Worker } from 'worker_threads';

export default function runSynchronizerWorker(
    options: WorkerOptions
): ISynchronizer {
    return new Worker(
        join(__dirname, './synchronizer.worker.js'),
        options
    ) as unknown as ISynchronizer;
}
