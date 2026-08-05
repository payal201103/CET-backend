CREATE TABLE parent_status_master
(
    psId INT IDENTITY(1,1) PRIMARY KEY,
    statusName NVARCHAR(200),
    createdAt DATETIME DEFAULT GETDATE()
);
