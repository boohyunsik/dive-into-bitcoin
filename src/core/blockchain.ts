import {Block} from "./block";
import {calculateHash} from "../utils/crypto_utils";

export class Blockchain {
    public chain: Block[] = [];

    constructor() {
        const genesisBlock = this.createGenesisBlock();
        this.chain.push(genesisBlock);
    }

    private createGenesisBlock(): Block {
        return {
            index: 0,
            previousHash: "0",
            timestamp: Date.now(),
            transactions: [],
            nonce: 0,
            hash: "GENESIS_HASH",
            merkleRoot: "GENESIS_MERKLE_ROOT"
        };
    }

    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    public addBlock(newBlock: Block) {
        console.log('addBlock', JSON.stringify(newBlock));
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = calculateHash(newBlock);
        this.chain.push(newBlock);
    }

    public isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== calculateHash(currentBlock)) {
                console.log('Invalid hash at block', i, currentBlock.hash, 'expected', calculateHash(currentBlock), 'data', currentBlock);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('Invalid previous hash at block', i, 'expected', previousBlock.hash, 'but got', currentBlock.previousHash);
                return false;
            }
        }
        return true;
    }
}