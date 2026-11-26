// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HidraInvest {
    struct Investidor {
        uint256 totalInvestido;
        uint256 saldoDisponivel;
        bool registrado;
    }

    struct Projeto {
        uint256 id;
        string nome;
        address walletProjeto;
        uint256 totalRecebido;
        bool ativo;
    }

    struct Alocacao {
        uint256 id;
        address investidor;
        uint256 projetoId;
        uint256 valor;
        uint256 timestamp;
    }
    
    address public admin;
    mapping(address => Investidor) public investidores;
    mapping(uint256 => Projeto) public projetos;
    Alocacao[] public alocacoes;

    // Índices de rastreio
    mapping(address => uint256[]) public alocacoesPorInvestidor;
    mapping(uint256 => uint256[]) public alocacoesPorProjeto;

    uint256 public proximoProjetoId = 1;

    event Deposito(address indexed investidor, uint256 valor);
    event ProjetoRegistrado(uint256 indexed projetoId, string nome);
    event AlocacaoRealizada(
        uint256 indexed alocacaoId,
        address indexed investidor,
        uint256 indexed projetoId,
        uint256 valor
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Apenas admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registrarProjeto(string calldata _nome, address _wallet)
        external onlyAdmin returns (uint256)
    {
        uint256 id = proximoProjetoId++;
        projetos[id] = Projeto(id, _nome, _wallet, 0, true);
        emit ProjetoRegistrado(id, _nome);
        return id;
    }

    function depositar() external payable {
        require(msg.value > 0, "Deposito vazio");
        Investidor storage inv = investidores[msg.sender];
        inv.registrado = true;
        inv.totalInvestido += msg.value;
        inv.saldoDisponivel += msg.value;
        emit Deposito(msg.sender, msg.value);
    }

    function alocar(address _investidor, uint256 _projetoId, uint256 _valor)
        external onlyAdmin returns (uint256)
    {
        Investidor storage inv = investidores[_investidor];
        Projeto storage p = projetos[_projetoId];

        require(inv.registrado, "Investidor nao registrado");
        require(p.ativo, "Projeto inativo");
        require(inv.saldoDisponivel >= _valor, "Saldo insuficiente");

        inv.saldoDisponivel -= _valor;
        p.totalRecebido += _valor;

        uint256 alocacaoId = alocacoes.length;
        alocacoes.push(Alocacao(
            alocacaoId, _investidor, _projetoId, _valor, block.timestamp
        ));

        alocacoesPorInvestidor[_investidor].push(alocacaoId);
        alocacoesPorProjeto[_projetoId].push(alocacaoId);

        (bool ok, ) = payable(p.walletProjeto).call{value: _valor}("");
        require(ok, "Transferencia falhou");

        emit AlocacaoRealizada(alocacaoId, _investidor, _projetoId, _valor);
        return alocacaoId;
    }

    // Consultas de rastreio
    function alocacoesDoInvestidor(address _investidor)
        external view returns (uint256[] memory)
    {
        return alocacoesPorInvestidor[_investidor];
    }

    function alocacoesDoProjeto(uint256 _projetoId)
        external view returns (uint256[] memory)
    {
        return alocacoesPorProjeto[_projetoId];
    }

    function getAlocacao(uint256 _id) external view returns (Alocacao memory) {
        return alocacoes[_id];
    }
}