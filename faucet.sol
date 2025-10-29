// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SepoliaFaucet {
    uint256 public claimAmount = 0.05 ether;
    uint256 public dailyLimit = 3;
    uint256 public cooldown = 3 hours;
    address public owner;

    struct User {
        uint256 lastClaim;
        uint256 claimsToday;
    }

    mapping(address => User) public users;

    event Claimed(address user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function claimReward() external {
        User storage user = users[msg.sender];

        require(address(this).balance >= claimAmount, "Insufficient balance");

        // Reset daily claims if 24h passed
        if (block.timestamp >= user.lastClaim + 1 days) {
            user.claimsToday = 0;
        }

        require(user.claimsToday < dailyLimit, "Daily limit reached");
        require(block.timestamp >= user.lastClaim + cooldown, "Too soon");

        user.lastClaim = block.timestamp;
        user.claimsToday++;

        payable(msg.sender).transfer(claimAmount);
        emit Claimed(msg.sender, claimAmount);
    }

    function getUserClaimInfo(
        address _user
    ) external view returns (uint256, uint256) {
        User memory user = users[_user];
        return (user.lastClaim, user.claimsToday);
    }

    function setClaimAmount(uint256 _amount) external onlyOwner {
        claimAmount = _amount;
    }

    function setDailyLimit(uint256 _limit) external onlyOwner {
        dailyLimit = _limit;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        payable(owner).transfer(_amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
