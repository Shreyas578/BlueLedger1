// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ProjectContract
 * @dev Individual project contract for tracking blue carbon projects
 */
contract ProjectContract is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Roles
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    bytes32 public constant MONITOR_ROLE = keccak256("MONITOR_ROLE");

    // Project status enum
    enum ProjectStatus {
        Initialized,
        Active,
        Monitoring,
        Completed,
        Suspended
    }

    // Project data structure
    struct ProjectData {
        uint256 applicationId;
        string projectName;
        string landCoordinates;
        uint256 areaHectares;
        string plantSpecies;
        address ngoAddress;
        address governmentApprover;
        uint256 createdAt;
        uint256 startDate;
        uint256 expectedCompletionDate;
        ProjectStatus status;
        uint256 targetCarbonCredits;
        uint256 totalCarbonCreditsEarned;
    }

    // NDVI reading structure
    struct NDVIReading {
        uint256 timestamp;
        uint256 ndviValue;
        uint256 vegetationCoverage;
        uint256 carbonCreditsEarned;
        string satelliteImageHash;
        address recorder;
        bool verified;
    }

    // State variables
    ProjectData public projectData;
    Counters.Counter private _ndviReadingIds;
    
    mapping(uint256 => NDVIReading) public ndviReadings;
    mapping(uint256 => bool) public verifiedReadings;

    // Carbon credit calculation parameters
    uint256 public constant NDVI_THRESHOLD = 6000;
    uint256 public constant BASE_CREDIT_RATE = 10;
    uint256 public constant MAX_CREDITS_PER_READING = 1000;

    // Events
    event ProjectInitialized(uint256 indexed applicationId, address indexed ngoAddress, string projectName);
    event NDVIReadingAdded(uint256 indexed readingId, uint256 ndviValue, uint256 carbonCreditsEarned, address indexed recorder);
    event NDVIReadingVerified(uint256 indexed readingId, address indexed verifier);
    event ProjectStatusUpdated(ProjectStatus oldStatus, ProjectStatus newStatus, address indexed updater);
    event CarbonCreditsCalculated(uint256 indexed readingId, uint256 creditsEarned, uint256 totalCredits);

    constructor(
        uint256 _applicationId,
        string memory _projectName,
        string memory _landCoordinates,
        uint256 _areaHectares,
        string memory _plantSpecies,
        address _ngoAddress,
        address _governmentApprover,
        uint256 _targetCarbonCredits
    ) {
        require(_areaHectares > 0, "Area must be greater than 0");
        require(_ngoAddress != address(0), "Invalid NGO address");
        require(_governmentApprover != address(0), "Invalid government address");

        _grantRole(DEFAULT_ADMIN_ROLE, _governmentApprover);
        _grantRole(GOVERNMENT_ROLE, _governmentApprover);
        _grantRole(NGO_ROLE, _ngoAddress);
        _grantRole(MONITOR_ROLE, _governmentApprover);

        projectData = ProjectData({
            applicationId: _applicationId,
            projectName: _projectName,
            landCoordinates: _landCoordinates,
            areaHectares: _areaHectares,
            plantSpecies: _plantSpecies,
            ngoAddress: _ngoAddress,
            governmentApprover: _governmentApprover,
            createdAt: block.timestamp,
            startDate: 0,
            expectedCompletionDate: 0,
            status: ProjectStatus.Initialized,
            targetCarbonCredits: _targetCarbonCredits,
            totalCarbonCreditsEarned: 0
        });

        emit ProjectInitialized(_applicationId, _ngoAddress, _projectName);
    }

    function addNDVIReading(uint256 _ndviValue, uint256 _vegetationCoverage, string memory _satelliteImageHash) 
        external 
        onlyRole(MONITOR_ROLE) 
        nonReentrant 
    {
        require(_ndviValue <= 10000, "NDVI value cannot exceed 1.0");
        require(_vegetationCoverage <= 10000, "Coverage cannot exceed 100%");

        _ndviReadingIds.increment();
        uint256 newReadingId = _ndviReadingIds.current();

        uint256 carbonCredits = calculateCarbonCredits(_ndviValue);

        NDVIReading storage newReading = ndviReadings[newReadingId];
        newReading.timestamp = block.timestamp;
        newReading.ndviValue = _ndviValue;
        newReading.vegetationCoverage = _vegetationCoverage;
        newReading.carbonCreditsEarned = carbonCredits;
        newReading.satelliteImageHash = _satelliteImageHash;
        newReading.recorder = msg.sender;
        newReading.verified = hasRole(GOVERNMENT_ROLE, msg.sender);

        projectData.totalCarbonCreditsEarned += carbonCredits;

        emit NDVIReadingAdded(newReadingId, _ndviValue, carbonCredits, msg.sender);
        emit CarbonCreditsCalculated(newReadingId, carbonCredits, projectData.totalCarbonCreditsEarned);
    }

    function calculateCarbonCredits(uint256 _ndviValue) public view returns (uint256) {
        if (_ndviValue < NDVI_THRESHOLD) {
            return 0;
        }

        uint256 ndviAboveThreshold = _ndviValue - NDVI_THRESHOLD;
        uint256 credits = (ndviAboveThreshold * projectData.areaHectares * BASE_CREDIT_RATE) / 10000;

        return credits > MAX_CREDITS_PER_READING ? MAX_CREDITS_PER_READING : credits;
    }

    function getNDVIReading(uint256 _readingId) external view returns (NDVIReading memory) {
        require(_readingId > 0 && _readingId <= _ndviReadingIds.current(), "Invalid reading ID");
        return ndviReadings[_readingId];
    }

    function getTotalNDVIReadings() external view returns (uint256) {
        return _ndviReadingIds.current();
    }

    function getProjectProgress() external view returns (uint256) {
        if (projectData.targetCarbonCredits == 0) {
            return 0;
        }
        
        uint256 progress = (projectData.totalCarbonCreditsEarned * 10000) / projectData.targetCarbonCredits;
        return progress > 10000 ? 10000 : progress;
    }
}