CREATE TABLE disability_master
(
    disabilityId INT IDENTITY(1,1) PRIMARY KEY,
    disabilityName VARCHAR(150) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);
