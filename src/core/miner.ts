import {Block} from "./block";
import {calculateHash} from "../utils/crypto_utils";
import {DIFFICULTY} from "../config";
import { buildMerkleRoot } from "./merkle_tree";

export class Miner {
    public mineBlock(block: Block): Block {
        console.log('start Mining, difficulty=', DIFFICULTY, 'block=', JSON.stringify(block));
        while (!this.isValidHash(block.hash)) {
            block.nonce++;
            block.hash = calculateHash(block);
            block.merkleRoot = buildMerkleRoot(block.transactions.map(tx => tx.id));
        }
        console.log('mining complete, block=', JSON.stringify(block));
        return block;
    }

    private isValidHash(hash: string): boolean {
        return hash.startsWith("0".repeat(DIFFICULTY));
    }
}