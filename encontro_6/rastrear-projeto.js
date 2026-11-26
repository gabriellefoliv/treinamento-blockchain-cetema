const {
    Client, ContractCallQuery, ContractFunctionParameters,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const projetoId = process.argv[2];

    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const params = new ContractFunctionParameters().addUint256(parseInt(projetoId));

    const query = new ContractCallQuery()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(300_000)
        .setFunction("alocacoesDoProjeto", params);

    const result = await query.execute(client);
    const ids = result.getUint256Array(0);
    console.log(`Alocacoes do projeto ${projetoId}:`, ids.map(i => i.toString()));
}

main().catch(console.error);