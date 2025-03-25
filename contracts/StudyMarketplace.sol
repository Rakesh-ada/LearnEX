// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StudyMarketplace
 * @dev Smart contract for a decentralized study material marketplace
 * @notice Current contract address: 0x775FeDAACfa5976E366A341171F3A59bcce383d0
 * @notice ABI Version: 1.0.0
 */
contract StudyMarketplace {
    // Struct to represent a study material
    struct StudyMaterial {
        uint256 id;
        address payable owner;
        string title;
        string description;
        string category;
        string contentHash; // IPFS hash of the content
        string previewHash; // IPFS hash of the preview (if any)
        string thumbnailHash; // IPFS hash of the thumbnail image (internal use only)
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }

    // Struct to track purchases
    struct Purchase {
        uint256 materialId;
        address buyer;
        uint256 purchaseDate;
    }

    // Counter for material IDs
    uint256 private _materialIdCounter;
    
    // Platform fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeePercent = 250; // 2.5%
    
    // Platform fee recipient address
    address payable public platformFeeRecipient;
    
    // Mapping from material ID to StudyMaterial
    mapping(uint256 => StudyMaterial) public materials;
    
    // Mapping from user address to array of owned material IDs
    mapping(address => uint256[]) public ownedMaterials;
    
    // Mapping from user address to array of purchased material IDs
    mapping(address => uint256[]) public purchasedMaterials;
    
    // Mapping to track if a user has purchased a specific material
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    
    // Array of all material IDs
    uint256[] public allMaterialIds;
    
    // Events
    event MaterialListed(uint256 indexed id, address indexed owner, string title, uint256 price);
    event MaterialPurchased(uint256 indexed id, address indexed buyer, address indexed seller, uint256 price);
    event MaterialUpdated(uint256 indexed id, string title, string description, uint256 price);
    event MaterialRemoved(uint256 indexed id);
    event ThumbnailUpdated(uint256 indexed id, string thumbnailHash);
    
    /**
     * @dev Constructor sets the platform fee recipient
     */
    constructor(address payable _platformFeeRecipient) {
        platformFeeRecipient = _platformFeeRecipient;
        _materialIdCounter = 1;
    }
    
    /**
     * @dev List a new study material
     */
    function listMaterial(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _contentHash,
        string memory _previewHash,
        string memory _thumbnailHash,
        uint256 _price
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        uint256 materialId = _materialIdCounter;
        _materialIdCounter++;
        
        materials[materialId] = StudyMaterial({
            id: materialId,
            owner: payable(msg.sender),
            title: _title,
            description: _description,
            category: _category,
            contentHash: _contentHash,
            previewHash: _previewHash,
            thumbnailHash: _thumbnailHash,
            price: _price,
            isActive: true,
            createdAt: block.timestamp
        });
        
        ownedMaterials[msg.sender].push(materialId);
        allMaterialIds.push(materialId);
        
        emit MaterialListed(materialId, msg.sender, _title, _price);
        
        // If thumbnail is provided, emit the thumbnail updated event
        if (bytes(_thumbnailHash).length > 0) {
            emit ThumbnailUpdated(materialId, _thumbnailHash);
        }
        
        return materialId;
    }
    
    /**
     * @dev Purchase a study material
     */
    function purchaseMaterial(uint256 _materialId) external payable {
        StudyMaterial storage material = materials[_materialId];
        
        require(material.isActive, "Material is not active");
        require(msg.sender != material.owner, "Cannot purchase your own material");
        require(msg.value >= material.price, "Insufficient payment");
        require(!hasPurchased[msg.sender][_materialId], "Already purchased this material");
        
        // Calculate platform fee
        uint256 platformFee = (material.price * platformFeePercent) / 10000;
        uint256 sellerAmount = material.price - platformFee;
        
        // Direct transfer to platform fee recipient and material owner
        (bool platformFeeSent, ) = platformFeeRecipient.call{value: platformFee}("");
        require(platformFeeSent, "Failed to send platform fee");
        
        (bool sellerPaid, ) = material.owner.call{value: sellerAmount}("");
        require(sellerPaid, "Failed to send payment to seller");
        
        // Refund excess payment
        if (msg.value > material.price) {
            (bool refundSent, ) = payable(msg.sender).call{value: msg.value - material.price}("");
            require(refundSent, "Failed to send refund");
        }
        
        // Record purchase
        purchasedMaterials[msg.sender].push(_materialId);
        hasPurchased[msg.sender][_materialId] = true;
        
        emit MaterialPurchased(_materialId, msg.sender, material.owner, material.price);
    }
    
    /**
     * @dev Update a study material's details
     */
    function updateMaterial(
        uint256 _materialId,
        string memory _title,
        string memory _description,
        uint256 _price
    ) external {
        StudyMaterial storage material = materials[_materialId];
        
        require(msg.sender == material.owner, "Only owner can update");
        require(material.isActive, "Material is not active");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        material.title = _title;
        material.description = _description;
        material.price = _price;
        
        emit MaterialUpdated(_materialId, _title, _description, _price);
    }
    
    /**
     * @dev Update a study material's thumbnail
     */
    function updateThumbnail(
        uint256 _materialId,
        string memory _thumbnailHash
    ) external {
        StudyMaterial storage material = materials[_materialId];
        
        require(msg.sender == material.owner, "Only owner can update thumbnail");
        require(material.isActive, "Material is not active");
        require(bytes(_thumbnailHash).length > 0, "Thumbnail hash cannot be empty");
        
        material.thumbnailHash = _thumbnailHash;
        
        emit ThumbnailUpdated(_materialId, _thumbnailHash);
    }
    
    /**
     * @dev Remove a study material from the marketplace
     */
    function removeMaterial(uint256 _materialId) external {
        StudyMaterial storage material = materials[_materialId];
        
        require(msg.sender == material.owner, "Only owner can remove");
        require(material.isActive, "Material is already inactive");
        
        material.isActive = false;
        
        emit MaterialRemoved(_materialId);
    }
    
    /**
     * @dev Update platform fee percentage (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercent) external {
        require(msg.sender == platformFeeRecipient, "Only platform owner can update fee");
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        
        platformFeePercent = _newFeePercent;
    }
    
    /**
     * @dev Get all materials owned by the caller
     */
    function getMyListedMaterials() external view returns (uint256[] memory) {
        return ownedMaterials[msg.sender];
    }
    
    /**
     * @dev Get all materials purchased by the caller
     */
    function getMyPurchasedMaterials() external view returns (uint256[] memory) {
        return purchasedMaterials[msg.sender];
    }
    
    /**
     * @dev Get material details by ID
     */
    function getMaterialDetails(uint256 _materialId) external view returns (
        uint256 id,
        address owner,
        string memory title,
        string memory description,
        string memory category,
        string memory previewHash,
        uint256 price,
        bool isActive,
        uint256 createdAt
    ) {
        StudyMaterial storage material = materials[_materialId];
        return (
            material.id,
            material.owner,
            material.title,
            material.description,
            material.category,
            material.previewHash,
            material.price,
            material.isActive,
            material.createdAt
        );
    }
    
    /**
     * @dev Get content hash (only available to owner or purchaser)
     */
    function getContentHash(uint256 _materialId) external view returns (string memory) {
        require(
            msg.sender == materials[_materialId].owner || hasPurchased[msg.sender][_materialId],
            "Only owner or purchaser can access content"
        );
        
        return materials[_materialId].contentHash;
    }
    
    /**
     * @dev Get thumbnail hash
     */
    function getThumbnailHash(uint256 _materialId) external view returns (string memory) {
        require(materials[_materialId].isActive, "Material is not active");
        return materials[_materialId].thumbnailHash;
    }
    
    /**
     * @dev Get total number of materials
     */
    function getTotalMaterials() external view returns (uint256) {
        return allMaterialIds.length;
    }
    
    /**
     * @dev Get all active material IDs with pagination
     */
    function getActiveMaterials(uint256 _offset, uint256 _limit) external view returns (uint256[] memory) {
        uint256 totalMaterials = allMaterialIds.length;
        
        if (_offset >= totalMaterials) {
            return new uint256[](0);
        }
        
        uint256 end = _offset + _limit;
        if (end > totalMaterials) {
            end = totalMaterials;
        }
        
        uint256 resultCount = end - _offset;
        uint256[] memory result = new uint256[](resultCount);
        
        uint256 resultIndex = 0;
        for (uint256 i = _offset; i < end; i++) {
            uint256 materialId = allMaterialIds[i];
            if (materials[materialId].isActive) {
                result[resultIndex] = materialId;
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get contract address
     * @return The address of this contract
     */
    function getContractAddress() external view returns (address) {
        return address(this);
    }
    
    /**
     * @dev Get contract version information
     * @return version The current version of the contract
     * @return abiCompatible Whether the current ABI is compatible
     */
    function getContractVersion() external pure returns (string memory version, bool abiCompatible) {
        return ("1.0.0", true);
    }
    
    /**
     * @dev Get material thumbnail information
     * @param _materialId The ID of the material to get thumbnail information for
     * @return thumbnailHash The IPFS hash of the thumbnail
     * @return title The title of the material
     * @return owner The address of the material owner
     * @return exists Whether the material exists and is active
     */
    function getMaterialThumbnailInfo(uint256 _materialId) external view returns (
        string memory thumbnailHash,
        string memory title,
        address owner,
        bool exists
    ) {
        StudyMaterial storage material = materials[_materialId];
        bool materialExists = material.id == _materialId && material.isActive;
        
        return (
            material.thumbnailHash,
            material.title,
            material.owner,
            materialExists
        );
    }
} 