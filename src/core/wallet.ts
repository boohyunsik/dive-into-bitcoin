import * as crypto from "crypto";
import { ec as EC } from "elliptic";
import {Transaction} from "./utxo";

const ec = new EC("secp256k1");

export class Wallet {
    public privateKey: string;
    public publicKey: string;
    public address: string;

    constructor() {
        const keypair = ec.genKeyPair();
        this.privateKey = keypair.getPrivate("hex");
        this.publicKey = keypair.getPublic("hex");
        this.address = this.publicKey.slice(0, 40);
    }

    public signTxIn(tx: Transaction, inputIndex: number): string {
        const msgHash = crypto.createHash("sha256").update(JSON.stringify(tx)).digest();
        const keyPair = ec.keyFromPrivate(this.privateKey, "hex");
        const signature = keyPair.sign(msgHash);
        return signature.toDER("hex");
    }
}