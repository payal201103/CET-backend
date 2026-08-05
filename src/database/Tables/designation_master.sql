CREATE TABLE designation_master
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    designationName VARCHAR(30) NOT NULL,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME()
);
