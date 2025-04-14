
export interface TxIn {
    txId: string;
    outputIndex: number;
    signature?: string;
    publicKey?: string;
}

export interface TxOut {
    address: string;
    amount: number;
}

export interface Transaction {
    id: string;
    inputs: TxIn[];
    outputs: TxOut[];
}

export function tranctionToString(tx: Transaction): string {
    return `${tx.id}:${JSON.stringify(tx.inputs)}:${JSON.stringify(tx.outputs)}`;
}

export class UTXOSet {
    private utxos: Map<string, TxOut>;

    constructor() {
        this.utxos = new Map<string, TxOut>();
    }

    public addUTXO(txId: string, outIndex: number, out: TxOut) {
        const key = `${txId}:${outIndex}`;
        this.utxos.set(key, out);
    }

    public removeUTXO(txId: string, outIndex: number) {
        const key = `${txId}:${outIndex}`;
        this.utxos.delete(key);
    }

    public getUTXO(txId: string, outIndex: number): TxOut | undefined {
        const key = `${txId}:${outIndex}`;
        return this.utxos.get(key);
    }

    public hasUTXO(txId: string, outIndex: number): boolean {
        const key = `${txId}:${outIndex}`;
        return this.utxos.has(key);
    }

    public dump() {
        console.log("[UTXO set]", Array.from(this.utxos.entries()));
    }
}