const {
    Client, ContractExecuteTransaction, ContractFunctionParameters,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const [nome, walletProjeto] = process.argv.slice(2);
    if (!nome || !walletProjeto) throw new Error("Uso: node registrar-projeto.js <nome> <wallet>");

    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const params = new ContractFunctionParameters()
        .addString(nome)
        .addAddress(AccountId.fromString(walletProjeto).toSolidityAddress());

    const tx = new ContractExecuteTransaction()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(500_000)
        .setFunction("registrarProjeto", params);

    const response = await tx.execute(client);
    const record = await response.getRecord(client);

    // Lê o retorno uint256 (id do projeto)
    const projetoId = record.contractFunctionResult.getUint256(0);
    console.log(`Projeto "${nome}" registrado com ID: ${projetoId}`);
}

main().catch(console.error);