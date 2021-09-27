import { BlockInfoDto, BlockNumberDto } from './etherscan.dto';

export interface IEtherscan {
    getLastBlockNumber(): Promise<BlockNumberDto>;
    getBlockByNumber(tag: string): Promise<BlockInfoDto>;
}
