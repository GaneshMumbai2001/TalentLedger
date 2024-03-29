// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    // Owner of the contract for administrative purposes
    address public owner;

    struct DID {
        bool exists;
        address controller; // The entity that controls this DID
        string publicKey; // Public key associated with this DID
        string authentication; // Authentication methods
        string serviceEndpoints; // Service endpoints
    }

    // Mapping of DID identifiers to their respective data
    mapping(string => DID) public dids;

    // Events for logging
    event DIDRegistered(string indexed didIdentifier, address controller);
    event DIDUpdated(string indexed didIdentifier, string publicKey, string authentication, string serviceEndpoints);
    event DIDDeactivated(string indexed didIdentifier);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyController(string memory didIdentifier) {
        require(dids[didIdentifier].controller == msg.sender, "Only the DID controller can perform this action.");
        _;
    }

    // Register a new DID
    function registerDID(
        string memory didIdentifier,
        string memory publicKey,
        string memory authentication,
        string memory serviceEndpoints
    ) public {
        require(!dids[didIdentifier].exists, "DID already exists.");
        dids[didIdentifier] = DID(true, msg.sender, publicKey, authentication, serviceEndpoints);
        emit DIDRegistered(didIdentifier, msg.sender);
    }

    // Update an existing DID
    function updateDID(
        string memory didIdentifier,
        string memory newPublicKey,
        string memory newAuthentication,
        string memory newServiceEndpoints
    ) public onlyController(didIdentifier) {
        DID storage did = dids[didIdentifier];
        require(did.exists, "DID does not exist.");
        did.publicKey = newPublicKey;
        did.authentication = newAuthentication;
        did.serviceEndpoints = newServiceEndpoints;
        emit DIDUpdated(didIdentifier, newPublicKey, newAuthentication, newServiceEndpoints);
    }

    // Deactivate a DID
    function deactivateDID(string memory didIdentifier) public onlyController(didIdentifier) {
        delete dids[didIdentifier];
        emit DIDDeactivated(didIdentifier);
    }
}