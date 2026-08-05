CREATE TABLE user_master (
    userId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    roleId INT NOT NULL,
    userName VARCHAR(50) NOT NULL,
    entityId VARCHAR(50) NOT NULL,
    mobileNo VARCHAR(15) NOT NULL,
    password VARCHAR(500) NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
    updatedAt DATETIME2(3) NULL,
    ipAddress VARCHAR(25),
);
