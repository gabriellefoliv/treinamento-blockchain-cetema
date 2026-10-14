# Blockchain na Prática

Treinamento sobre blockchain usando a rede **Hedera** como estudo de caso principal, ministrado para bolsistas do laboratório CETEMA entre setembro e novembro de 2026.

## Estrutura do repositório

```
.
├── encontro_1/   # Fundamentos (teoria)
├── encontro_2/   # Primeira prática na Hedera testnet
├── encontro_3/   # Tokens e NFTs
├── encontro_4/   # Tokens e NFTs (prática)
├── encontro_5/   # Smart contracts: conceitos e Solidity básico
├── encontro_6/   # Smart contracts na Hedera (prática)
└── encontro_7/   # Arquitetura de uma aplicação completa (HIDRA)
```

Aulas teóricas contêm o .pptx apresentado e aulas práticas contêm o código trabalhado.

## Roteiro geral (7 encontros, 1h cada)

| #   | Tema                                                                                                                                                         | Formato               | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ------ |
| 1   | **Fundamentos** — o problema que blockchain resolve, hash, blocos, chaves, consenso, redes, HTS/HCS/contratos em visão geral                                 | Teoria                | ✅     |
| 2   | **Primeira prática** — conta na testnet, HashScan, consultar saldo, transferir HBAR, criar conta por código                                                  | Prática               | ✅     |
| 3   | **Tokens e NFTs** — história dos tokens, fungível x não-fungível, Hedera Token Service (HTS), chaves de um token, criar token, criar coleção NFT, mintar NFT | Teoria                | ✅     |
| 4   | **Tokens e NFTs** — Criar token, criar coleção NFT, mintar NFT                                                                                               | Prática               | ✅     |
| 5   | **Smart contracts: conceitos e Solidity básico** — EVM, gas, estado, eventos, variáveis, funções, modifiers, mappings, primeiro contrato no Remix            | Teoria + Prática leve | ⏳     |
| 6   | **Smart contracts na Hedera** — deploy na testnet, chamar funções pelo SDK, ler eventos, integrar contrato e token                                           | Prática               | ⏳     |
| 7   | **Arquitetura de uma aplicação completa** — on-chain x off-chain, Mirror Node, carteiras, HCS para registro de eventos, oráculos, segurança                  | Teoria                | ⏳     |

## Pré-requisitos gerais

- Node.js 18 ou mais recente
- Editor de código (recomendado: VS Code)
- Conta na [Hedera testnet](https://portal.hedera.com), criada com chave **ECDSA** (necessária a partir do Encontro 2)
- SDK usado nos exemplos de código: [`@hiero-ledger/sdk`](https://www.npmjs.com/package/@hiero-ledger/sdk) (pacote atual; o antigo `@hashgraph/sdk` ainda funciona, mas está sendo descontinuado)

Cada pasta de encontro com código tem seu próprio `README.md` com o setup específico (`.env`, dependências, ordem dos scripts).

## Links de referência

- [Documentação oficial da Hedera](https://docs.hedera.com)
- [Portal da Hedera (criar conta testnet)](https://portal.hedera.com)
- [HashScan — explorador público da testnet](https://hashscan.io/testnet)
- [Calculadora de taxas da Hedera](https://hedera.com/fees)
