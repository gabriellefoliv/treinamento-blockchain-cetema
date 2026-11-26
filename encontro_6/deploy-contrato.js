const {
    Client, ContractCreateTransaction, PrivateKey, AccountId, Hbar
} = require("@hiero-ledger/sdk");
const fs = require("fs");
require("dotenv").config();

async function main() {
    const client = Client.forTestnet();
    client.setOperator(
        AccountId.fromString(process.env.OPERATOR_ID),
        PrivateKey.fromStringECDSA(process.env.OPERATOR_KEY)
    );

    // Opcional: mantém o teto alto como segurança
    client.setDefaultMaxTransactionFee(new Hbar(20));

    const { bytecode } = JSON.parse(
        fs.readFileSync("./compiled/HidraInvest.json", "utf8")
    );

    const tx = new ContractCreateTransaction()
        .setBytecode(bytecode)
        .setGas(2_000_000)
        .setMaxTransactionFee(new Hbar(500)); // ← Teto explícito e generoso

    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);

    console.log("Contrato deployado em:", receipt.contractId.toString());
    console.log("Guarde este ID para os próximos scripts.");
}

main().catch(console.error);