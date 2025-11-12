// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CarbonCreditToken
 * @dev ERC-20 token representing blue carbon credits
 */
contract CarbonCreditToken is ERC20, ERC20Burnable, AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant PROJECT_ROLE = keccak256("PROJECT_ROLE");

    // Token metadata
    string private _tokenName = "Blue Carbon Credit";
    string private _tokenSymbol = "BCC";
    uint8 private _tokenDecimals = 18;

    // Credit tracking structures
    struct CreditBatch {
        uint256 batchId;
        address projectContract;
        uint256 amount;
        uint256 mintTimestamp;
        string projectName;
        string landCoordinates;
        uint256 ndviReadingId;
        bool retired;
    }

    struct RetirementRecord {
        uint256 batchId;
        address retiredBy;
        uint256 amount;
        uint256 retirementTimestamp;
        string retirementReason;
    }

    // State variables
    Counters.Counter private _batchIds;
    Counters.Counter private _retirementIds;

    mapping(uint256 => CreditBatch) public creditBatches;
    mapping(address => uint256[]) public userBatches;
    mapping(uint256 => RetirementRecord) public retirements;
    mapping(address => uint256) public totalMintedByProject;
    mapping(address => uint256) public totalRetiredByUser;

    uint256 public totalSupplyMinted;
    uint256 public totalSupplyRetired;

    // Events
    event CreditsMinted(
        uint256 indexed batchId,
        address indexed projectContract,
        address indexed recipient,
        uint256 amount,
        string projectName
    );

    event CreditsRetired(
        uint256 indexed retirementId,
        uint256 indexed batchId,
        address indexed retiredBy,
        uint256 amount,
        string reason
    );

    event ProjectAuthorized(
        address indexed projectContract,
        address indexed authorizer
    );

    event ProjectDeauthorized(
        address indexed projectContract,
        address indexed deauthorizer
    );

    // Modifiers
    modifier onlyAuthorizedMinter() {
        require(
            hasRole(MINTER_ROLE, msg.sender) || 
            hasRole(PROJECT_ROLE, msg.sender) || 
            hasRole(GOVERNMENT_ROLE, msg.sender),
            "Caller is not authorized to mint"
        );
        _;
    }

    modifier validBatchId(uint256 _batchId) {
        require(_batchId > 0 && _batchId <= _batchIds.current(), "Invalid batch ID");
        _;
    }

    constructor(address _governmentAddress) ERC20(_tokenName, _tokenSymbol) {
        require(_governmentAddress != address(0), "Invalid government address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, _governmentAddress);
        _grantRole(GOVERNMENT_ROLE, _governmentAddress);
        _grantRole(MINTER_ROLE, _governmentAddress);
    }

    /**
     * @dev Mint carbon credits for a specific project
     * @param _projectContract Address of the project contract
     * @param _recipient Address to receive the credits
     * @param _amount Amount of credits to mint
     * @param _projectName Name of the project
     * @param _landCoordinates Land coordinates of the project
     * @param _ndviReadingId ID of the NDVI reading that triggered minting
     */
    function mintCredits(
        address _projectContract,
        address _recipient,
        uint256 _amount,
        string memory _projectName,
        string memory _landCoordinates,
        uint256 _ndviReadingId
    ) external onlyAuthorizedMinter nonReentrant {
        require(_projectContract != address(0), "Invalid project contract");
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_projectName).length > 0, "Project name required");

        // Create new batch
        _batchIds.increment();
        uint256 newBatchId = _batchIds.current();

        CreditBatch storage newBatch = creditBatches[newBatchId];
        newBatch.batchId = newBatchId;
        newBatch.projectContract = _projectContract;
        newBatch.amount = _amount;
        newBatch.mintTimestamp = block.timestamp;
        newBatch.projectName = _projectName;
        newBatch.landCoordinates = _landCoordinates;
        newBatch.ndviReadingId = _ndviReadingId;
        newBatch.retired = false;

        // Update tracking
        userBatches[_recipient].push(newBatchId);
        totalMintedByProject[_projectContract] += _amount;
        totalSupplyMinted += _amount;

        // Mint tokens
        _mint(_recipient, _amount);

        emit CreditsMinted(newBatchId, _projectContract, _recipient, _amount, _projectName);
    }

    /**
     * @dev Retire carbon credits (burn tokens)
     * @param _batchId ID of the credit batch to retire
     * @param _amount Amount of credits to retire
     * @param _reason Reason for retirement
     */
    function retireCredits(
        uint256 _batchId,
        uint256 _amount,
        string memory _reason
    ) external validBatchId(_batchId) nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(!creditBatches[_batchId].retired, "Batch already retired");
        require(bytes(_reason).length > 0, "Retirement reason required");

        // Create retirement record
        _retirementIds.increment();
        uint256 newRetirementId = _retirementIds.current();

        RetirementRecord storage newRetirement = retirements[newRetirementId];
        newRetirement.batchId = _batchId;
        newRetirement.retiredBy = msg.sender;
        newRetirement.amount = _amount;
        newRetirement.retirementTimestamp = block.timestamp;
        newRetirement.retirementReason = _reason;

        // Update tracking
        totalRetiredByUser[msg.sender] += _amount;
        totalSupplyRetired += _amount;

        // Mark batch as retired if fully retired
        if (_amount == creditBatches[_batchId].amount) {
            creditBatches[_batchId].retired = true;
        }

        // Burn tokens
        _burn(msg.sender, _amount);

        emit CreditsRetired(newRetirementId, _batchId, msg.sender, _amount, _reason);
    }

    /**
     * @dev Authorize a project contract to mint credits
     * @param _projectContract Address of the project contract
     */
    function authorizeProject(address _projectContract) 
        external 
        onlyRole(GOVERNMENT_ROLE) 
    {
        require(_projectContract != address(0), "Invalid project contract");
        grantRole(PROJECT_ROLE, _projectContract);
        emit ProjectAuthorized(_projectContract, msg.sender);
    }

    /**
     * @dev Deauthorize a project contract
     * @param _projectContract Address of the project contract
     */
    function deauthorizeProject(address _projectContract) 
        external 
        onlyRole(GOVERNMENT_ROLE) 
    {
        revokeRole(PROJECT_ROLE, _projectContract);
        emit ProjectDeauthorized(_projectContract, msg.sender);
    }

    /**
     * @dev Get credit batch information
     * @param _batchId ID of the batch
     * @return CreditBatch struct
     */
    function getCreditBatch(uint256 _batchId) 
        external 
        view 
        validBatchId(_batchId) 
        returns (CreditBatch memory) 
    {
        return creditBatches[_batchId];
    }

    /**
     * @dev Get user's credit batches
     * @param _user Address of the user
     * @return Array of batch IDs
     */
    function getUserBatches(address _user) external view returns (uint256[] memory) {
        return userBatches[_user];
    }

    /**
     * @dev Get retirement record
     * @param _retirementId ID of the retirement
     * @return RetirementRecord struct
     */
    function getRetirementRecord(uint256 _retirementId) 
        external 
        view 
        returns (RetirementRecord memory) 
    {
        require(_retirementId > 0 && _retirementId <= _retirementIds.current(), "Invalid retirement ID");
        return retirements[_retirementId];
    }

    /**
     * @dev Get total number of credit batches
     * @return Total batch count
     */
    function getTotalBatches() external view returns (uint256) {
        return _batchIds.current();
    }

    /**
     * @dev Get total number of retirements
     * @return Total retirement count
     */
    function getTotalRetirements() external view returns (uint256) {
        return _retirementIds.current();
    }

    /**
     * @dev Get project statistics
     * @param _projectContract Address of the project contract
     * @return totalMinted Total credits minted by project
     */
    function getProjectStats(address _projectContract) 
        external 
        view 
        returns (uint256 totalMinted) 
    {
        return totalMintedByProject[_projectContract];
    }

    /**
     * @dev Get user statistics
     * @param _user Address of the user
     * @return totalRetired Total credits retired by user
     * @return currentBalance Current token balance
     */
    function getUserStats(address _user) 
        external 
        view 
        returns (uint256 totalRetired, uint256 currentBalance) 
    {
        return (totalRetiredByUser[_user], balanceOf(_user));
    }

    /**
     * @dev Get global token statistics
     * @return totalMinted Total credits ever minted
     * @return totalRetired Total credits ever retired
     * @return currentSupply Current circulating supply
     */
    function getGlobalStats() 
        external 
        view 
        returns (uint256 totalMinted, uint256 totalRetired, uint256 currentSupply) 
    {
        return (totalSupplyMinted, totalSupplyRetired, totalSupply());
    }

    /**
     * @dev Check if an address is an authorized project
     * @param _projectContract Address to check
     * @return Boolean indicating authorization status
     */
    function isAuthorizedProject(address _projectContract) external view returns (bool) {
        return hasRole(PROJECT_ROLE, _projectContract);
    }

    /**
     * @dev Override decimals to return 18 (standard for carbon credits)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Grant minter role to an address (Government only)
     * @param _account Address to grant role to
     */
    function grantMinterRole(address _account) external onlyRole(GOVERNMENT_ROLE) {
        grantRole(MINTER_ROLE, _account);
    }

    /**
     * @dev Emergency pause function (Government only)
     * Note: This would require implementing Pausable if needed
     */
    function emergencyMint(
        address _recipient,
        uint256 _amount,
        string memory _reason
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        
        _mint(_recipient, _amount);
        
        // Log as emergency batch
        _batchIds.increment();
        uint256 emergencyBatchId = _batchIds.current();
        
        CreditBatch storage emergencyBatch = creditBatches[emergencyBatchId];
        emergencyBatch.batchId = emergencyBatchId;
        emergencyBatch.projectContract = address(0);
        emergencyBatch.amount = _amount;
        emergencyBatch.mintTimestamp = block.timestamp;
        emergencyBatch.projectName = _reason;
        emergencyBatch.landCoordinates = "Emergency Mint";
        emergencyBatch.ndviReadingId = 0;
        emergencyBatch.retired = false;

        totalSupplyMinted += _amount;
    }
}