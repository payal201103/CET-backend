CREATE TABLE approver_master (
    approverId BIGINT PRIMARY KEY,
    name VARCHAR(100)  NULL,
    districtId INT NOT NULL,
    blockId INT NOT NULL,
    mobileNo VARCHAR(10) NULL,
    designationId INT NULL,
    isActive BIT NOT NULL,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
    updatedAt DATETIME2(3) NULL,
    ipAddress VARCHAR(25) NULL
);
