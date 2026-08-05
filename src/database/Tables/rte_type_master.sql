CREATE TABLE rte_type_master
(
    rteType INT IDENTITY(1,1) PRIMARY KEY,
    rteTypeName NVARCHAR(200) NULL,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
);
