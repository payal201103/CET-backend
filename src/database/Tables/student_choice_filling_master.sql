CREATE TABLE student_choice_filling_master
(
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    childUID BIGINT NOT NULL,
    schoolId BIGINT NOT NULL,
    priority INT NOT NULL,
    roundNo INT NOT NULL,
    isDeleted BIT DEFAULT 0 NOT NULL,
    createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
    updatedAt DATETIME2(3) NULL,
    ipAddress VARCHAR(25) NULL
)
