CREATE TABLE school_management_master (
    schoolManagementId INT PRIMARY KEY,
    schoolManagementName VARCHAR(100) NOT NULL,
    createdAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    updatedAt DATETIME2(0) NULL
);
