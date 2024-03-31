// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobPlatform {
    struct Dispute {
        address raiser;
        address against;
        string reason;
        uint256 raiserVotes;
        uint256 againstVotes;
        bool resolved;
    }

    Dispute[] public disputes;
    mapping(address => mapping(address => bool)) public disputeExists; // Modified mapping
    mapping(address => uint256) public disputeCount; // Dispute count
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyDisputeRaiser(uint256 _disputeIndex) {
        require(msg.sender == disputes[_disputeIndex].raiser, "Only dispute raiser can call this function");
        _;
    }

    modifier onlyDisputeAgainst(uint256 _disputeIndex) {
        require(msg.sender == disputes[_disputeIndex].against, "Only dispute against can call this function");
        _;
    }

    modifier onlyUnresolvedDispute(uint256 _disputeIndex) {
        require(!disputes[_disputeIndex].resolved, "Dispute is already resolved");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function raiseDispute(address _against, string memory _reason) external {
        require(_against != address(0), "Invalid address");
        require(_against != msg.sender, "Cannot raise dispute against yourself");
        require(!disputeExists[msg.sender][_against], "A dispute already exists between these parties");

        disputes.push(Dispute({
            raiser: msg.sender,
            against: _against,
            reason: _reason,
            raiserVotes: 0,
            againstVotes: 0,
            resolved: false
        }));

        disputeExists[msg.sender][_against] = true;
        disputeCount[msg.sender]++;
        disputeCount[_against]++;
    }

    function vote(uint256 _disputeIndex, uint256 _vote) external onlyAdmin {
        require(_vote == 0 || _vote == 1, "Invalid vote"); // 0 for against, 1 for raiser
        Dispute storage dispute = disputes[_disputeIndex];

        if (_vote == 0) {
            dispute.againstVotes++;
            if (dispute.againstVotes > dispute.raiserVotes) {
                disputeCount[dispute.against]--;
            }
        } else {
            dispute.raiserVotes++;
            if (dispute.raiserVotes > dispute.againstVotes) {
                disputeCount[dispute.raiser]--;
            }
        }
    }

    function resolveDispute(uint256 _disputeIndex) external onlyAdmin {
        Dispute storage dispute = disputes[_disputeIndex];
        require(!dispute.resolved, "Dispute is already resolved");

        if (dispute.raiserVotes > dispute.againstVotes) {
            disputeCount[dispute.against]--;
        } else {
            disputeCount[dispute.raiser]--;
        }
        dispute.resolved = true;
    }

    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }

    function getAllDisputes() external view returns (Dispute[] memory) {
        return disputes;
    }

    function getDispute(uint256 _disputeIndex) external view returns (address raiser, address against, string memory reason, uint256 raiserVotes, uint256 againstVotes, bool resolved) {
        Dispute storage dispute = disputes[_disputeIndex];
        return (dispute.raiser, dispute.against, dispute.reason, dispute.raiserVotes, dispute.againstVotes, dispute.resolved);
    }
}