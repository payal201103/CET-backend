-- 1. Create branches table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'branches' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.branches (
        branchId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        branchName VARCHAR(150) NOT NULL,
        city VARCHAR(100) NULL,
        isActive BIT DEFAULT 1,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END
GO

-- 2. Alter users table to add branchId
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.users') AND name = 'branchId'
)
BEGIN
    ALTER TABLE dbo.users 
    ADD branchId INT NULL FOREIGN KEY REFERENCES dbo.branches(branchId);
END
GO

-- 3. Alter job_cards table to add branchId
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.job_cards') AND name = 'branchId'
)
BEGIN
    ALTER TABLE dbo.job_cards 
    ADD branchId INT NULL FOREIGN KEY REFERENCES dbo.branches(branchId);
END
GO

-- 4. Seed initial branches if table is empty
IF NOT EXISTS (SELECT 1 FROM dbo.branches)
BEGIN
    INSERT INTO dbo.branches (branchName, city, isActive)
    VALUES 
    ('Exotic Ahmedabad', 'Ahmedabad', 1),
    ('Exotic Gandhinagar', 'Gandhinagar', 1);
END
GO

-- 5. Assign existing users and job cards to the first branch (Exotic Ahmedabad, ID = 1)
IF EXISTS (SELECT 1 FROM dbo.branches WHERE branchId = 1)
BEGIN
    EXEC('UPDATE dbo.users SET branchId = 1 WHERE role <> ''Super Admin'' AND branchId IS NULL');
    EXEC('UPDATE dbo.job_cards SET branchId = 1 WHERE branchId IS NULL');
END
GO
