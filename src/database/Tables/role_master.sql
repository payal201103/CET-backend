CREATE TABLE role_master (
    roleId INT NOT NULL PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL,
    isActive BIT,
    createdAt DATETIME2(3) NULL,
    updatedAt DATETIME2(3) NULL,
);
