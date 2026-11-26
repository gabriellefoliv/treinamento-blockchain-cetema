const {
    Client, ContractExecuteTransaction, Hbar,
    PrivateKey, AccountId
} = require("@hiero-ledger/sdk");
require("dotenv").config();

async function main() {
    const valor = parseFloat(process.argv[2]);
    if (!valor || valor <= 0) throw new Error("Informe um valor em HBAR");

    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const tx = new ContractExecuteTransaction()
        .setContractId(process.env.CONTRACT_ID)
        .setGas(300_000)
        .setPayableAmount(new Hbar(valor))
        .setFunction("depositar");

    const response = await tx.execute(client);
    await response.getReceipt(client);

    console.log(`Deposito de ${valor} HBAR realizado por ${process.env.OPERATOR_ID}`);
}

main().catch(console.error);