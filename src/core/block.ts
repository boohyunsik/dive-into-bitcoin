import {Transaction} from "./utxo";

export interface Block {
    index: number;
    previousHash: string;
    timestamp: number;
    transactions: Transaction[];
    nonce: number;
    hash: string;
}