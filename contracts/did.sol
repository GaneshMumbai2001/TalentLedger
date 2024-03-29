// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GIGToken is ERC20, ERC20Burnable {
    constructor() ERC20("TLY Token", "TLY") {
        _mint(msg.sender, 10000000 * (10 ** uint256(decimals())));
    }

    function sendTokens(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }
}

contract DIDAndEscrowRegistry is GIGToken {
    address public owner;

    enum Role { Provider, Developer }

    struct DID {
        bool exists;
        Role role;
        string ipfsHash;
    }

    struct Escrow {
        address provider;
        address candidate;
        uint256 amount;
        bool isApproved;
    }

    mapping(address => DID) public dids;
    mapping(uint256 => Escrow) public escrows;
    uint256 public nextEscrowId;

    event DIDRegistered(address indexed controller, Role role, string ipfsHash);
    event EscrowCreatedAndAssigned(uint256 indexed escrowId, address indexed provider, address indexed candidate, uint256 amount);
    event EscrowCreated(uint256 indexed escrowId, address indexed provider, uint256 amount);
    event CandidateAssigned(uint256 indexed escrowId, address indexed candidate);
    event EscrowClaimed(uint256 indexed escrowId, address indexed candidate, uint256 amount);
    event DIDUpdated(address indexed controller, Role role, string ipfsHash);
    event DIDDeactivated(address indexed controller);
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyController(address controller) {
        require(dids[controller].exists, "Only the DID controller can perform this action.");
        _;
    }

    constructor() GIGToken() {
        owner = msg.sender;
    }

   function registerDID(
        address controller,
        Role role,
        string memory ipfsHash
    ) public {
        require(!dids[controller].exists, "DID already exists.");
        dids[controller] = DID(true, role, ipfsHash);
        emit DIDRegistered(controller, role, ipfsHash);
        sendTokens(controller, 100 * (10 ** uint256(decimals())));
    }
    function updateDID(
        address controller,
        Role newRole,
        string memory newIpfsHash
    ) public onlyController(controller) {
        DID storage did = dids[controller];
        did.role = newRole;
        did.ipfsHash = newIpfsHash;
        emit DIDUpdated(controller, newRole, newIpfsHash);
    }

    function deactivateDID(address controller) public onlyController(controller) {
        delete dids[controller];
        emit DIDDeactivated(controller);
    }

    function getDIDInfo(address controller) public view returns (bool, Role, string memory) {
        DID storage did = dids[controller];
        require(did.exists, "DID does not exist.");
        return (did.exists, did.role, did.ipfsHash);
    }
    function createAndAssignEscrow(uint256 amount, address candidate) public returns (uint256) {
        uint256 escrowId = nextEscrowId++;
        escrows[escrowId] = Escrow(msg.sender, candidate, amount, false);
        emit EscrowCreatedAndAssigned(escrowId, msg.sender, candidate, amount);
        return escrowId;
    }

    function approveAndClaim(uint256 escrowId) public {
        require(msg.sender == escrows[escrowId].provider, "Only the provider can approve");
        escrows[escrowId].isApproved = true;
        Escrow memory escrow = escrows[escrowId];
        require(escrow.candidate != address(0), "Candidate not assigned");
        require(escrow.isApproved, "Escrow not approved");
        sendTokens(escrow.candidate, escrow.amount);
        emit EscrowClaimed(escrowId, escrow.candidate, escrow.amount);
    }
}
