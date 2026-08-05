CREATE TABLE session_master (
    sessionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    userId BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL,
    logoutType VARCHAR(50),
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
    updatedAt DATETIME2(3) NULL,
    ipAddress VARCHAR(25),
);
