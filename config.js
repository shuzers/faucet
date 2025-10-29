// Configuration Settings
const CONFIG = {
    // Smart Contract Configuration
    CONTRACT_ADDRESS: '0xe7378d385B6998F54146DaE5AEDf28f3Ac5b4ed7', // ⚠️ REPLACE WITH YOUR CONTRACT ADDRESS

    // Etherscan API Configuration
    ETHERSCAN_API_KEY: 'YZZ29UR9JHWCT9BFPB82RITNFYFQ3YJ1GT', // ⚠️ REPLACE WITH YOUR API KEY
    ETHERSCAN_API_URL: 'https://api-sepolia.etherscan.io/v2/api',

    // Faucet Settings
    REQUIRED_ADS: 5,
    REWARD_AMOUNT: '0.05', // ETH

    // Network Configuration
    SEPOLIA_CHAIN_ID: '0xaa36a7', // 11155111 in hex
    SEPOLIA_RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY', // Optional

    // LocalStorage Keys
    STORAGE_KEY: 'faucet_ads_watched',

    // UI Settings
    ALERT_DURATION: 5000, // milliseconds
    BALANCE_REFRESH_INTERVAL: 30000 // 30 seconds
};

// Smart Contract ABI
// ⚠️ Add your complete contract ABI here
const CONTRACT_ABI = [
    "function claimReward() external",
    "function getUserClaimInfo(address user) external view returns (uint256 lastClaimTime, uint256 claimsToday)",
    "function dailyLimit() external view returns (uint256)",
    "function cooldown() external view returns (uint256)",
    "function claimAmount() external view returns (uint256)",
    "function getBalance() external view returns (uint256)"
];

// Network Configuration for MetaMask
const SEPOLIA_NETWORK = {
    chainId: CONFIG.SEPOLIA_CHAIN_ID,
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'SepoliaETH',
        decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, CONTRACT_ABI, SEPOLIA_NETWORK };
}