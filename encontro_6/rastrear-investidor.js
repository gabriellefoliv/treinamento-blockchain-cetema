const {
    Client, ContractCallQuery, ContractFunctionParameters,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const investidor = process.argv[2];
    if (!investidor) throw new Error("Informe o Account ID do investidor");

    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const params = new ContractFunctionParameters()
        .addAddress(AccountId.fromString(investidor).toSolidityAddress());

    // 1) Saldo e total investido
    const queryInv = new ContractCallQuery()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(200_000)
        .setFunction("investidores", params);

    const resultInv = await queryInv.execute(client);
    console.log("Total investido:", resultInv.getUint256(0).toString());
    console.log("Saldo disponivel:", resultInv.getUint256(1).toString());

    // 2) Lista de alocações (os "caminhos")
    const queryAloc = new ContractCallQuery()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(300_000)
        .setFunction("alocacoesDoInvestidor", params);

    const resultAloc = await queryAloc.execute(client);
    const ids = resultAloc.getUint256Array(0);
    console.log("Alocacoes do investidor:", ids.map(id => id.toString()));

    // 3) Detalhe de cada alocação
    for (const id of ids) {
        const p = new ContractFunctionParameters().addUint256(id);
        const q = new ContractCallQuery()
            .setContractId(process.env.CONTRACT_ID)
            .setGas(200_000)
            .setFunction("getAlocacao", p);
        const r = await q.execute(client);
        console.log(`  Alocacao #${id}: projeto ${r.getUint256(2).toString()}, valor ${r.getUint256(3).toString()}`);
    }
}

main().catch(console.error);