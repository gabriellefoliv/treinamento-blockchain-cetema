const { Client, AccountCreateTransaction, PrivateKey, Hbar, AccountId } = require("@hiero-ledger/sdk");
require("dotenv").config();

async function criarConta(client, nome, saldoHbar) {
    const novaChave = PrivateKey.generateECDSA();
    const tx = new AccountCreateTransaction()
        .setKey(novaChave.publicKey)
        .setInitialBalance(new Hbar(saldoHbar));
    const receipt = await (await tx.execute(client)).getReceipt(client);
    console.log(`--- ${nome} ---`);
    console.log(`Account ID: ${receipt.accountId.toString()}`);
    console.log(`Private Key: ${novaChave.toStringDer()}`);
    return { id: receipt.accountId.toString(), key: novaChave.toStringDer() };
}

async function main() {
    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    const inv = await criarConta(client, "INVESTIDOR", 50);
    const solar = await criarConta(client, "PROJETO_SOLAR", 5);
    const eolica = await criarConta(client, "PROJETO_EOLICA", 5);

    console.log("\n=== Cole no .env ===");
    console.log(`INVESTIDOR_ID=${inv.id}`);
    console.log(`INVESTIDOR_KEY=${inv.key}`);
    console.log(`PROJETO_SOLAR_ID=${solar.id}`);
    console.log(`PROJETO_EOLICA_ID=${eolica.id}`);
}

main().catch(console.error);