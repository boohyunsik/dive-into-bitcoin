# Dive into Bitcoin

이 프로젝트는 간단한 UTXO 기반 블록체인을 시뮬레이션하기 위한 토이 프로젝트입니다.

타입스크립트로 구현됐으며, 다음 기능을 구현하고 있습니다.

* 지갑을 통해 개인키, 공개키, 주소 생성
* UTXO 모델(트랜잭션 입력과 출력)
* 서명 및 검증(ECDSA)
* 간단한 P2P 시뮬레이션
* 작업 증명 채굴 (블록 해시와 난이도)
* 코인베이스 트랜잭션

## 프로젝트 구조
```
dive-into-bitcoin/
├── src/
│   ├── main.ts
│   ├── core/
│   │   ├── blockchain.ts
│   │   ├── block.ts
│   │   ├── utxo.ts
│   │   ├── miner.ts
│   │   ├── p2pnode.ts
│   │   └── wallet.ts
│   ├── utils/
│   │   └── crypto_utils.ts
│   └── config/
│       └── index.ts
├── package.json
└── tsconfig.json
```

## 실행 방법

타입스크립트와 ts-node를 설치합니다.

```shell
npm install -g typescript
npm install -g ts-node
```

프로젝트 의존성 라이브러리를 설치합니다.

```shell
yarn
```

main 파일을 실행합니다.

```shell
ts-node src/main.ts
```

## 모듈

### 1. `core/blockchain.ts`

블록체인 전체 상태를 관리하고 여러 함수를 제공합니다.
블록을 추가하고 체인의 유효성을 검사하는 로직을 제공합니다.

### 2. `core/block.ts`

블록 구조를 정의하는 인터페이스

### 3. `core/utxo.ts`

UTXO(Unspent Transaction Output) 모델을 구현합니다.
* TxIn : 이전 트랜잭션의 특정 출력을 참조해 코인을 사용하는 입력 트랜잭션
* TxOut : 새로 만들어진 코인의 소유권
* Transaction : 하나 이상의 `TxIn`과 `TxOut`을 갖고, 고유 트랜잭션 해시를 갖음

### 4. `core/miner.ts`

작업증명 채굴 로직을 간단하게 구현합니다.

일정 난이도(`DIFFICULTY`)를 만족하는 해시를 찾기 위해 블록 해시를 반복적으로 계산합니다.

### 5. `core/p2pnode.ts`

P2P 시뮬레이션을 담당하는 노드 클래스입니다.

### 6. `core/wallet.ts`

사용자의 개인키, 공개키, 주소를 생성하고 보관합니다.

`elliptic` 라이브러리의 `secp256k1` 타원곡선을 이용하여 키쌍을 만들고 서명합니다.

### 7. `utils/crypto_utils.ts`

해시 함수(SHA-256) 및 서명, 검증 관련 유틸

블록 해시를 계산(`createBlockHash`)하고, 트랜잭션을 검증(`verifyTxIn`)하는 함수를 제공합니다.