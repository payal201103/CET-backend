CREATE TABLE caste_master
(
    categoryId INT PRIMARY KEY,
    casteName NVARCHAR(100) NOT NULL,
    createdAt DATETIME2(0) DEFAULT SYSDATETIME()
);
