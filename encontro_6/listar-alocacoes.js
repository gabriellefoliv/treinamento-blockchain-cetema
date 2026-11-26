const {
    Client, ContractCallQuery,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    // Consulta o array público `alocacoes` pelo índice
    let i = 0;
    while (true) {
        try {
            const q = new ContractCallQuery()
                .setContractId(process.env.CONTRACT_ID)
                .setGas(100_000)
                .setFunction("alocacoes", new (require("@hiero-ledger/sdk").ContractFunctionParameters)().addUint256(i));
            const r = await q.execute(client);
            console.log(`#${i}: investidor=${r.getAddress(1)}, projeto=${r.getUint256(2)}, valor=${r.getUint256(3)}`);
            i++;
        } catch {
            break; // acabaram as alocações
        }
    }
}

main().catch(console.error);