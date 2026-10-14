import { Client, AccountId, PrivateKey, MirrorNodeAccountBalanceQuery } from "@hiero-ledger/sdk";
import "dotenv/config";

async function main() {
    const operatorId = AccountId.fromString(process.env.ACCOUNT_ID)
    const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_PRIVATE_KEY)

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    console.log("Consultando saldo da conta: ", operatorId.toString());

    const balance = await new MirrorNodeAccountBalanceQuery()
        .setAccountId(operatorId)
        .execute(client);

    console.log("Saldo da conta: ", balance.toString());

    client.close();
}

main().catch((err) => {
    console.error("Erro: ", err);
    process.exit(1);
});