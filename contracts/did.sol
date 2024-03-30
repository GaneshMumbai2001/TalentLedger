// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

// GIGToken remains mostly unchanged as it's already concise and utilizes inheritance efficiently.
contract GIGToken is ERC20, ERC20Burnable {
    constructor() ERC20("TLY Token", "TLY") {
        _mint(msg.sender, 10_000_000 * (10 ** uint256(decimals())));
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
    event DIDUpdated(address indexed controller, Role role, string ipfsHash);
    event DIDDeactivated(address indexed controller);
    event EscrowCreatedAndAssigned(uint256 indexed escrowId, address indexed provider, address indexed candidate, uint256 amount);
    event EscrowClaimed(uint256 indexed escrowId, address indexed candidate, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyController(address controller) {
        require(dids[controller].exists, "Controller does not exist.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Improved comments for clarity and added checks for safer operations.
    // Added rewarding tokens upon DID registration to incentivize usage.
    function registerDID(address controller, Role role, string calldata ipfsHash) external {
        require(!dids[controller].exists, "DID already exists.");
        dids[controller] = DID(true, role, ipfsHash);
        emit DIDRegistered(controller, role, ipfsHash);
        // Reward tokens to the new DID registration.
        sendTokens(controller, 100 * (10 ** uint256(decimals())));
    }

    function updateDID(address controller, Role newRole, string calldata newIpfsHash) external onlyController(controller) {
        DID storage did = dids[controller];
        did.role = newRole;
        did.ipfsHash = newIpfsHash;
        emit DIDUpdated(controller, newRole, newIpfsHash);
    }

    function deactivateDID(address controller) external onlyController(controller) {
        delete dids[controller];
        emit DIDDeactivated(controller);
    }

    function getDIDInfo(address controller) public view returns (bool, Role, string memory) {
        DID storage did = dids[controller];
        require(did.exists, "DID does not exist.");
        return (did.exists, did.role, did.ipfsHash);
    }

    function createAndAssignEscrow(uint256 amount, address candidate) external returns (uint256 escrowId) {
        escrowId = nextEscrowId++;
        escrows[escrowId] = Escrow(msg.sender, candidate, amount, false);
        emit EscrowCreatedAndAssigned(escrowId, msg.sender, candidate, amount);
    }

    function approveAndClaim(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.provider, "Only the provider can approve");
        require(!escrow.isApproved, "Escrow already approved");
        require(escrow.candidate != address(0), "Candidate not assigned");

        escrow.isApproved = true;
        sendTokens(escrow.candidate, escrow.amount);
        emit EscrowClaimed(escrowId, escrow.candidate, escrow.amount);
    }
}
