import { Client, AccountId, PrivateKey, Hbar, MirrorNodeAccountBalanceQuery, TransferTransaction } from "@hiero-ledger/sdk";
import "dotenv/config";

async function main() {
    const operatorId = AccountId.fromString(process.env.ACCOUNT_ID)
    const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_PRIVATE_KEY)
    const destinoAccountId = AccountId.fromString(process.env.DESTINO_ACCOUNT_ID);

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const saldoAntes = await new MirrorNodeAccountBalanceQuery()
        .setAccountId(operatorId)
        .execute(client);

    console.log("Saldo da conta antes da transferência: ", saldoAntes.hbars.toString());

    console.log("Transferindo 1 HBAR para a conta: ", destinoAccountId.toString());

    const transacao = await new TransferTransaction()
        .addHbarTransfer(operatorId, new Hbar(-2))
        .addHbarTransfer(destinoAccountId, new Hbar(2))
        .execute(client);

    const recibo = await transacao.getReceipt(client);
    console.log("Transferência realizada com sucesso! Status: ", recibo.status.toString());
    console.log("Veja no HashScan: https://hashscan.io/testnet/transaction/" + transacao.transactionId.toString());

    const saldoDepois = await new MirrorNodeAccountBalanceQuery()
        .setAccountId(operatorId)
        .execute(client);

    console.log("Saldo da conta depois da transferência: ", saldoDepois.hbars.toString());


    client.close();
}

main().catch((err) => {
    console.error("Erro: ", err);
    process.exit(1);
});