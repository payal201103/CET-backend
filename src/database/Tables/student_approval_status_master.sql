CREATE TABLE student_approval_status_master
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    childUID BIGINT NOT NULL,
    approverId BIGINT NOT NULL,
    section1 BIT NULL,
    section1RejectedReason NVARCHAR(1000) NULL,
    section2 BIT NULL,
    section2RejectedReason NVARCHAR(1000) NULL,
    section3 BIT NULL,
    section3RejectedReason NVARCHAR(1000) NULL,
    section4 BIT NULL,
    section4RejectedReason NVARCHAR(1000) NULL,
    section5 BIT NULL,
    section5RejectedReason NVARCHAR(1000) NULL,
    isDeleted BIT NOT NULL,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
    ipAddress VARCHAR(25) NULL
);
