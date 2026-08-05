CREATE TABLE gender_master
(
    genderId INT IDENTITY(1,1) PRIMARY KEY,
    genderName VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);
