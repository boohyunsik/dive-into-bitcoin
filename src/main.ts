import {P2pNode} from "./core/p2pnode";
import {Wallet} from "./core/wallet";
import {Transaction, TxIn, TxOut} from "./core/utxo";
import {getTransactionId} from "./utils/crypto_utils";

function findCoinbaseTxId(node: P2pNode): string {
    for (const block of node.blockchain.chain) {
        for (const tx of block.transactions) {
            if (tx.id.startsWith("COINBASE")) {
                return tx.id;
            }
        }
    }
    throw new Error("Coinbase transaction not found");
}

function main() {
    const nodeA = new P2pNode("node-A");
    const nodeB = new P2pNode("node-B");
    const nodeC = new P2pNode("node-C");

    const network = [nodeA, nodeB, nodeC];

    nodeA.connectToNetwork([...network]);
    nodeB.connectToNetwork([...network]);
    nodeC.connectToNetwork([...network]);

    const walletA = new Wallet();
    const walletB = new Wallet();

   console.log("=== Start Mining #1 (NodeA) ===");
   nodeA.minePendingTransactions(walletA.address);

   console.log("[After 1st mining]");
   nodeA.dumpUTXOSet();
   nodeB.dumpUTXOSet();
   nodeC.dumpUTXOSet();

   const coinbaseTxId = findCoinbaseTxId(nodeA);
   console.log("[A -> B] coinbaseTxId=", coinbaseTxId);

   const input: TxIn = {
       txId: coinbaseTxId,
       outputIndex: 0,
       publicKey: walletA.publicKey,
   };
   const output1: TxOut = {
       address: walletB.address,
       amount: 10,
   };
   const output2: TxOut = {
       address: walletA.address,
       amount: 40,
   };

   let tx: Transaction = {
       id: "",
       inputs: [input],
       outputs: [output1, output2],
   };
   tx.id = getTransactionId(tx);
   tx.inputs[0].signature = walletA.signTxIn(tx, 0);

   nodeA.receiveTransaction(tx);

   console.log("=== Start Mining #2 (NodeA) ===");
   nodeA.minePendingTransactions(walletA.address);

    console.log("[After 2nd mining]");
    nodeA.dumpUTXOSet();
    nodeB.dumpUTXOSet();
    nodeC.dumpUTXOSet();
}

main();