const fs = require("fs");
const solc = require("solc");
const path = require("path");

const contractPath = path.join(__dirname, "contracts", "HidraInvest.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
    language: "Solidity",
    sources: { "HidraInvest.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts["HidraInvest.sol"]["HidraInvest"];

fs.mkdirSync(path.join(__dirname, "compiled"), { recursive: true });
fs.writeFileSync(
    path.join(__dirname, "compiled", "HidraInvest.json"),
    JSON.stringify({ abi: contract.abi, bytecode: contract.evm.bytecode.object }, null, 2)
);

console.log("Compilado. ABI + bytecode em compiled/HidraInvest.json");