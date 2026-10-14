import { Client, AccountId, PrivateKey, Hbar, AccountCreateTransaction } from "@hiero-ledger/sdk";
import "dotenv/config";

async function main() {
    const operatorId = AccountId.fromString(process.env.ACCOUNT_ID)
    const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_PRIVATE_KEY)

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const novaChavePrivada = PrivateKey.generateECDSA();
    const novaChavePublica = novaChavePrivada.publicKey;

    console.log("Chave privada da nova conta: ", novaChavePrivada.toStringDer());

    const transacao = new AccountCreateTransaction()
        .setECDSAKeyWithAlias(novaChavePublica)
        .setInitialBalance(new Hbar(1));

    const resposta = await transacao.execute(client);
    const recibo = await resposta.getReceipt(client);
    const novaContaId = recibo.accountId;

    console.log("Nova conta criada com sucesso! ID da nova conta: ", novaContaId.toString());

    console.log("Veja no HashScan: https://hashscan.io/testnet/account/" + novaContaId.toString());

    client.close();
}

main().catch((err) => {
    console.error("Erro: ", err);
    process.exit(1);
});