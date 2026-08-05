CREATE TABLE sub_caste_master
(
    subCategoryId INT PRIMARY KEY,
    subCasteName NVARCHAR(100) NOT NULL,
    createdAt DATETIME2(0) DEFAULT SYSDATETIME()
);
