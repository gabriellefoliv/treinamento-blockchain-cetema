const {
    Client, ContractExecuteTransaction, ContractFunctionParameters,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const [investidor, projetoId, valor] = process.argv.slice(2);
    if (!investidor || !projetoId || !valor) {
        throw new Error("Uso: node alocar.js <investidor> <projetoId> <valor>");
    }

    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const params = new ContractFunctionParameters()
        .addAddress(AccountId.fromString(investidor).toSolidityAddress())
        .addUint256(parseInt(projetoId))
        .addUint256(parseInt(valor)); // em tinybars ou unidade definida

    const tx = new ContractExecuteTransaction()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(500_000)
        .setFunction("alocar", params);

    const response = await tx.execute(client);
    const record = await response.getRecord(client);

    const alocacaoId = record.contractFunctionResult.getUint256(0);
    console.log(`Alocacao #${alocacaoId}: ${valor} para projeto ${projetoId}`);
}

main().catch(console.error);