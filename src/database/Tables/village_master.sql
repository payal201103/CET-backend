CREATE TABLE village_master
(
    villageId INT NOT NULL,
    blockId INT NOT NULL,
    villageName VARCHAR(50) NOT NULL,
    clusterId BIGINT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);
