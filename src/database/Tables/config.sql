CREATE TABLE config (
    id VARCHAR(20) PRIMARY KEY,
    description VARCHAR(50) NULL,
    value bit NULL,
    updatedAt DATETIME2(3) NULL
);
