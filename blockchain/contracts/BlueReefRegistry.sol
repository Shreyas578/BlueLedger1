// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BlueReefRegistry
 * @dev Registry contract for managing blue carbon project applications
 */
contract BlueReefRegistry is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Roles
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Application status enum
    enum ApplicationStatus {
        Pending,
        UnderReview,
        Approved,
        Rejected,
        RequiresMoreInfo
    }

    // User type enum
    enum UserType {
        NGO,
        Panchayat,
        Government
    }

    // Application structure
    struct Application {
        uint256 id;
        address applicant;
        UserType userType;
        string organizationName;
        string documentHash; // IPFS hash of uploaded documents
        string landCoordinates; // JSON string of polygon coordinates
        uint256 areaHectares;
        string plantSpecies;
        ApplicationStatus status;
        uint256 submissionTimestamp;
        uint256 reviewTimestamp;
        address reviewer;
        string reviewComments;
        address projectContractAddress; // Set when approved
    }

    // State variables
    Counters.Counter private _applicationIds;
    mapping(uint256 => Application) public applications;
    mapping(address => uint256[]) public userApplications;
    mapping(address => bool) public registeredUsers;
    mapping(address => UserType) public userTypes;

    // Events
    event ApplicationSubmitted(
        uint256 indexed applicationId,
        address indexed applicant,
        UserType userType,
        string organizationName
    );

    event ApplicationStatusUpdated(
        uint256 indexed applicationId,
        ApplicationStatus oldStatus,
        ApplicationStatus newStatus,
        address indexed reviewer
    );

    event UserRegistered(
        address indexed user,
        UserType userType,
        string organizationName
    );

    event ProjectContractDeployed(
        uint256 indexed applicationId,
        address indexed projectContract
    );

    // Modifiers
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier onlyGovernmentOrVerifier() {
        require(
            hasRole(GOVERNMENT_ROLE, msg.sender) || hasRole(VERIFIER_ROLE, msg.sender),
            "Caller is not government or verifier"
        );
        _;
    }

    modifier validApplicationId(uint256 _applicationId) {
        require(_applicationId > 0 && _applicationId <= _applicationIds.current(), "Invalid application ID");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOVERNMENT_ROLE, msg.sender);
    }

    /**
     * @dev Register a new user in the system
     * @param _userType Type of user (NGO, Panchayat, Government)
     * @param _organizationName Name of the organization
     */
    function registerUser(
        UserType _userType,
        string memory _organizationName
    ) external {
        require(!registeredUsers[msg.sender], "User already registered");
        require(bytes(_organizationName).length > 0, "Organization name required");

        registeredUsers[msg.sender] = true;
        userTypes[msg.sender] = _userType;

        emit UserRegistered(msg.sender, _userType, _organizationName);
    }

    /**
     * @dev Submit a new application for blue carbon project
     * @param _organizationName Name of the applying organization
     * @param _documentHash IPFS hash of uploaded documents
     * @param _landCoordinates JSON string of land polygon coordinates
     * @param _areaHectares Area of land in hectares
     * @param _plantSpecies Species of plants to be grown
     */
    function submitApplication(
        string memory _organizationName,
        string memory _documentHash,
        string memory _landCoordinates,
        uint256 _areaHectares,
        string memory _plantSpecies
    ) external onlyRegisteredUser nonReentrant {
        require(bytes(_organizationName).length > 0, "Organization name required");
        require(bytes(_documentHash).length > 0, "Document hash required");
        require(bytes(_landCoordinates).length > 0, "Land coordinates required");
        require(_areaHectares > 0, "Area must be greater than 0");
        require(bytes(_plantSpecies).length > 0, "Plant species required");

        _applicationIds.increment();
        uint256 newApplicationId = _applicationIds.current();

        Application storage newApplication = applications[newApplicationId];
        newApplication.id = newApplicationId;
        newApplication.applicant = msg.sender;
        newApplication.userType = userTypes[msg.sender];
        newApplication.organizationName = _organizationName;
        newApplication.documentHash = _documentHash;
        newApplication.landCoordinates = _landCoordinates;
        newApplication.areaHectares = _areaHectares;
        newApplication.plantSpecies = _plantSpecies;
        newApplication.status = ApplicationStatus.Pending;
        newApplication.submissionTimestamp = block.timestamp;

        userApplications[msg.sender].push(newApplicationId);

        emit ApplicationSubmitted(
            newApplicationId,
            msg.sender,
            userTypes[msg.sender],
            _organizationName
        );
    }

    /**
     * @dev Update application status (government/verifier only)
     * @param _applicationId ID of the application
     * @param _newStatus New status for the application
     * @param _comments Review comments
     */
    function updateApplicationStatus(
        uint256 _applicationId,
        ApplicationStatus _newStatus,
        string memory _comments
    ) external onlyGovernmentOrVerifier validApplicationId(_applicationId) {
        Application storage application = applications[_applicationId];
        ApplicationStatus oldStatus = application.status;

        require(oldStatus != _newStatus, "Status is already set to this value");
        require(oldStatus != ApplicationStatus.Approved, "Cannot modify approved application");

        application.status = _newStatus;
        application.reviewTimestamp = block.timestamp;
        application.reviewer = msg.sender;
        application.reviewComments = _comments;

        emit ApplicationStatusUpdated(_applicationId, oldStatus, _newStatus, msg.sender);
    }

    /**
     * @dev Set project contract address for approved application
     * @param _applicationId ID of the application
     * @param _projectContract Address of the deployed project contract
     */
    function setProjectContract(
        uint256 _applicationId,
        address _projectContract
    ) external onlyGovernmentOrVerifier validApplicationId(_applicationId) {
        require(_projectContract != address(0), "Invalid project contract address");
        
        Application storage application = applications[_applicationId];
        require(application.status == ApplicationStatus.Approved, "Application must be approved");
        require(application.projectContractAddress == address(0), "Project contract already set");

        application.projectContractAddress = _projectContract;

        emit ProjectContractDeployed(_applicationId, _projectContract);
    }

    /**
     * @dev Get application details
     * @param _applicationId ID of the application
     * @return Application struct
     */
    function getApplication(uint256 _applicationId) 
        external 
        view 
        validApplicationId(_applicationId) 
        returns (Application memory) 
    {
        return applications[_applicationId];
    }

    /**
     * @dev Get all applications by a user
     * @param _user Address of the user
     * @return Array of application IDs
     */
    function getUserApplications(address _user) external view returns (uint256[] memory) {
        return userApplications[_user];
    }

    /**
     * @dev Get applications by status
     * @param _status Status to filter by
     * @return Array of application IDs
     */
    function getApplicationsByStatus(ApplicationStatus _status) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256 totalApplications = _applicationIds.current();
        uint256[] memory tempResults = new uint256[](totalApplications);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalApplications; i++) {
            if (applications[i].status == _status) {
                tempResults[count] = i;
                count++;
            }
        }

        // Create array with exact size
        uint256[] memory results = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            results[i] = tempResults[i];
        }

        return results;
    }

    /**
     * @dev Get total number of applications
     * @return Total application count
     */
    function getTotalApplications() external view returns (uint256) {
        return _applicationIds.current();
    }

    /**
     * @dev Check if user is registered
     * @param _user Address to check
     * @return Boolean indicating registration status
     */
    function isUserRegistered(address _user) external view returns (bool) {
        return registeredUsers[_user];
    }

    /**
     * @dev Get user type
     * @param _user Address to check
     * @return UserType of the user
     */
    function getUserType(address _user) external view returns (UserType) {
        require(registeredUsers[_user], "User not registered");
        return userTypes[_user];
    }

    /**
     * @dev Grant government role to an address (admin only)
     * @param _account Address to grant role to
     */
    function grantGovernmentRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GOVERNMENT_ROLE, _account);
    }

    /**
     * @dev Grant verifier role to an address (admin only)
     * @param _account Address to grant role to
     */
    function grantVerifierRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, _account);
    }
}