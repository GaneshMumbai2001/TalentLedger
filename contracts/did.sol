pragma solidity ^0.8.0;

contract DIDRegistry {
    address public owner;

    enum Role { Provider, Developer }

    struct DID {
        bool exists;
        Role role;
        string ipfsHash;
    }

    mapping(address => DID) public dids;

    event DIDRegistered(address indexed controller, Role role, string ipfsHash);
    event DIDUpdated(address indexed controller, Role role, string ipfsHash);
    event DIDDeactivated(address indexed controller);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyController(address controller) {
        require(dids[controller].exists, "Only the DID controller can perform this action.");
        _;
    }

    function registerDID(
        address controller,
        Role role,
        string memory ipfsHash
    ) public {
        require(!dids[controller].exists, "DID already exists.");
        dids[controller] = DID(true, role, ipfsHash);
        emit DIDRegistered(controller, role, ipfsHash);
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
}
