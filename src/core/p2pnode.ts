import {Blockchain} from "./blockchain";
import {Miner} from "./miner";
import {Transaction} from "./utxo";
import {Block} from "./block";
import {verifyTxIn} from "../utils/crypto_utils";
import {UTXOSet} from "./utxo";

export class P2pNode {
    public blockchain: Blockchain;
    private identifier: string;
    private miner: Miner;
    private network: P2pNode[];

    private txPool: Transaction[] = [];
    private knownTx: Set<string> = new Set();

    private utxoSet: UTXOSet;

    constructor(identifier: string) {
        this.identifier = identifier;
        this.blockchain = new Blockchain();
        this.miner = new Miner();
        this.network = [];
        this.utxoSet = new UTXOSet();
    }

    public connectToNetwork(nodes: P2pNode[]) {
        this.network= nodes;
    }

    public receiveTransaction(tx: Transaction) {
        if (this.knownTx.has(tx.id)) {
            return;
        }

        console.log(`P2PNode ${this.identifier} received tx`);
        this.txPool.push(tx);
        this.knownTx.add(tx.id);

        for (const node of this.network) {
            if (node !== this) {
                node.receiveTransaction(tx);
            }
        }
    }

    public minePendingTransactions(minerAddress: string) {
        console.log(`node ${this.identifier}, minePendingTransactions...`);

        const coinbaseTx: Transaction = {
            id: "COINBASE" + Date.now(),
            inputs: [{ txId: "COINBASE", outputIndex: 0 }],
            outputs: [{ address: minerAddress, amount: 50 }]
        };

        const blockTransactions: Transaction[] = [coinbaseTx, ...this.txPool];
        const validTransactions: Transaction[] = [];
        for (const tx of blockTransactions) {
            if (this.isValidTransaction(tx)) {
                validTransactions.push(tx);
            } else {
                console.log("Invalid transaction", tx);
            }
        }

        const newBlock: Block = {
            index: this.blockchain.chain.length,
            previousHash: this.blockchain.getLatestBlock().hash,
            timestamp: Date.now(),
            transactions: validTransactions,
            nonce: 0,
            hash: "",
            merkleRoot: "",
        };
        const minedBlock = this.miner.mineBlock(newBlock);
        this.blockchain.addBlock(minedBlock);
        this.updateUTXOSet(minedBlock);
        this.txPool = [];

        console.log('[network]', this.network);
        for (const node of this.network) {
            if (node !== this) {
                console.log('send block to ', node.identifier);
                node.receiveNewBlock(minedBlock);
            }
        }
    }

    public receiveNewBlock(block: Block) {
        console.log(`node ${this.identifier}: receiveNewBlock`, block, this.blockchain.getLatestBlock());
        const localLatestBlock = this.blockchain.getLatestBlock();
        if (block.index > localLatestBlock.index) {
            this.blockchain.chain.push(block);
            if (!this.blockchain.isChainValid()) {
                console.log(`node: ${this.identifier} invalid block, rollback...`);
                this.blockchain.chain.pop();
            } else {
                this.rebuildUTXOSet();
            }
        }
    }

    private isValidTransaction(tx: Transaction): boolean {
        if (tx.id.startsWith("COINBASE")) {
            return true;
        }

        let totalInputAmount = 0;
        for (let i = 0; i < tx.inputs.length; i++) {
            const input = tx.inputs[i];
            const utxo = this.utxoSet.getUTXO(input.txId, input.outputIndex);
            if (!utxo) {
                return false;
            }
            if (!this.checkAddressMatch(utxo.address, input.publicKey)) {
                return false;
            }

            if (!verifyTxIn(tx, i)) {
                return false;
            }
            totalInputAmount += utxo.amount;
        }

        let totalOutputAmount = 0;
        for (const out of tx.outputs) {
            totalOutputAmount += out.amount;
        }
        if (totalOutputAmount > totalInputAmount) {
            return false;
        }

        return true;
    }

    private checkAddressMatch(utxoAddress: string, publicKey: string): boolean {
        const derivedAddress = publicKey.slice(0, 40);
        return derivedAddress === utxoAddress;
    }

    private updateUTXOSet(block: Block) {
        for (const tx of block.transactions) {
            if (!tx.id.startsWith("COINBASE")) {
                for (const input of tx.inputs) {
                    this.utxoSet.removeUTXO(input.txId, input.outputIndex);
                }
            }

            tx.outputs.forEach((out, idx) => {
                this.utxoSet.addUTXO(tx.id, idx, out);
            });
        }
    }

    private rebuildUTXOSet() {
        console.log(`node: ${this.identifier} rebuildUTXOSet`);
        const newUTXOSet = new UTXOSet();

        for (let i = 0; i < this.blockchain.chain.length; i++) {
            const block = this.blockchain.chain[i];
            for (const tx of block.transactions) {
                if (!tx.id.startsWith("COINBASE")) {
                    for (const input of tx.inputs) {
                        newUTXOSet.removeUTXO(input.txId, input.outputIndex);
                    }
                }
                tx.outputs.forEach((out, idx) => {
                    newUTXOSet.addUTXO(tx.id, idx, out);
                });
            }
        }
        this.utxoSet = newUTXOSet;
    }

    public dumpUTXOSet() {
        this.utxoSet.dump();
    }
}