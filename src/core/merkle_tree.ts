import { sha256 } from "../utils/crypto_utils";

function hashPair(a: string, b: string): string {
    return sha256(a + b);
}

export function buildMerkleRoot(txHashes: string[]): string {
    if (txHashes.length === 0) {
        return "";
    }

    let level = txHashes;
    while (level.length > 1) {
        if (level.length % 2 !== 0) {
            level.push(level[level.length - 1]);
        }
        const newLevel: string[] = [];

        for (let i = 0; i < level.length; i += 2) {
            const left = level[i];
            const right = level[i + 1];
            newLevel.push(hashPair(left, right));
        }
        level = newLevel;
    }

    return level[0];
}