-- Video Posting Migration: Tables setup
-- 1. video_posting_pending table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_posting_pending' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_posting_pending (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        carDetails VARCHAR(250) NOT NULL,
        videoType VARCHAR(50) NOT NULL, -- 'Reel' or 'YouTube'
        status VARCHAR(50) NOT NULL DEFAULT 'On Track', -- 'On Track', 'At Risk', 'Delayed'
        videographer VARCHAR(100) NOT NULL,
        dueDate DATETIME2(3) NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- 2. video_posting_completed table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_posting_completed' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_posting_completed (
        id INT NOT NULL PRIMARY KEY, -- Matches the ID from video_posting_pending
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        carDetails VARCHAR(250) NOT NULL,
        videoType VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Completed',
        videographer VARCHAR(100) NOT NULL,
        dueDate DATETIME2(3) NOT NULL,
        completedDate DATETIME2(3) DEFAULT SYSDATETIME(),
        isActive BIT NOT NULL DEFAULT 0,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- Insert seed data if empty
IF NOT EXISTS (SELECT 1 FROM dbo.video_posting_pending) AND NOT EXISTS (SELECT 1 FROM dbo.video_posting_completed)
BEGIN
    INSERT INTO dbo.video_posting_pending (jobCardNo, customerName, carDetails, videoType, status, videographer, dueDate, isActive)
    VALUES 
    ('JC-0753', 'Mihir Sinh', 'Skoda Slavia · GJ01AB4433', 'YouTube', 'On Track', 'Jignesh Videographer', '2026-07-17', 1),
    ('JC-0761', 'Jaydip Solanki', 'Toyota Innova · GJ05KL2211', 'YouTube', 'At Risk', 'Dev M.', '2026-07-20', 1);

    INSERT INTO dbo.video_posting_completed (id, jobCardNo, customerName, carDetails, videoType, status, videographer, dueDate, completedDate, isActive)
    VALUES 
    (201, 'JC-0721', 'Arjun Mehta', 'BMW M3 2023 · MH01AB1234', 'Reel', 'Completed', 'Rahul S.', '2026-07-10', '2026-07-11', 0),
    (202, 'JC-0733', 'Karan Patel', 'Mercedes GLE 2024 · GJ05EF9012', 'YouTube', 'Completed', 'Dev M.', '2026-07-12', '2026-07-13', 0);
END
