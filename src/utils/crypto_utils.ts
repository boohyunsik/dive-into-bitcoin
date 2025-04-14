import {Block} from "../core/block";
import * as crypto from "crypto";
import {Transaction} from "../core/utxo";
import {ec as EC} from "elliptic";

const ec = new EC("secp256k1");

export function calculateHash(block: Block): string {
    const data = block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce;
    return crypto.createHash("sha256").update(data).digest("hex");
}


export function getTransactionId(tx: Transaction): string {
    const inputString = tx.inputs.map((i) => `${i.txId}:${i.outputIndex}`).join("|");
    const outputString = tx.outputs.map((o) => `${o.address}:${o.amount}}`).join("|");
    const str = inputString + "#" + outputString;
    return crypto.createHash("sha256").update(str).digest("hex");
}

export function verifyTxIn(tx: Transaction, inputIndex: number): boolean {
    const input = tx.inputs[inputIndex];
    if (!input.signature || !input.publicKey) {
        return false;
    }

    const msgHash = crypto.createHash("sha256").update(JSON.stringify(tx)).digest();
    const keyPair = ec.keyFromPublic(input.publicKey, "hex");
    return keyPair.verify(msgHash, input.signature);
}