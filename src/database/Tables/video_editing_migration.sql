-- Video Editing Migration: Tables setup
-- 1. video_editing_pending table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_editing_pending' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_editing_pending (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        carDetails VARCHAR(250) NOT NULL,
        videoType VARCHAR(50) NOT NULL, -- 'Reel' or 'YouTube'
        status VARCHAR(50) NOT NULL DEFAULT 'On Track', -- 'On Track', 'At Risk', 'Delayed'
        videographer VARCHAR(100) NOT NULL,
        editor VARCHAR(100) NULL,
        dueDate DATETIME2(3) NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- 2. video_editing_completed table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_editing_completed' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_editing_completed (
        id INT NOT NULL PRIMARY KEY, -- Matches the ID from video_editing_pending
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        carDetails VARCHAR(250) NOT NULL,
        videoType VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Completed',
        videographer VARCHAR(100) NOT NULL,
        editor VARCHAR(100) NULL,
        dueDate DATETIME2(3) NOT NULL,
        completedDate DATETIME2(3) DEFAULT SYSDATETIME(),
        isActive BIT NOT NULL DEFAULT 0,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- Insert seed data if empty
IF NOT EXISTS (SELECT 1 FROM dbo.video_editing_pending) AND NOT EXISTS (SELECT 1 FROM dbo.video_editing_completed)
BEGIN
    INSERT INTO dbo.video_editing_pending (jobCardNo, customerName, carDetails, videoType, status, videographer, editor, dueDate, isActive)
    VALUES 
    ('JC-0745', 'Dhairya Shah DSA', 'Mercedes GLS · GJ38BL0072', 'Reel', 'Delayed', 'Jignesh Videographer', 'Dhaval Editor', '2026-07-14', 1),
    ('JC-0758', 'Rakesh Bhai', 'Maruti Suzuki Invicto · GJ01WP9578', 'Reel', 'On Track', 'Aisha K.', 'Dhaval Editor', '2026-07-18', 1),
    ('JC-0764', 'Priya Sharma', 'Porsche 911 · MH02CD5678', 'Reel', 'On Track', 'Rahul S.', 'Preet L.', '2026-07-21', 1);

    INSERT INTO dbo.video_editing_completed (id, jobCardNo, customerName, carDetails, videoType, status, videographer, editor, dueDate, completedDate, isActive)
    VALUES 
    (101, 'JC-0721', 'Arjun Mehta', 'BMW M3 2023 · MH01AB1234', 'Reel', 'Completed', 'Rahul S.', 'Dhaval Editor', '2026-07-10', '2026-07-11', 0),
    (102, 'JC-0733', 'Karan Patel', 'Mercedes GLE 2024 · GJ05EF9012', 'YouTube', 'Completed', 'Dev M.', 'Preet L.', '2026-07-12', '2026-07-13', 0),
    (103, 'JC-0742', 'Sana Ali', 'Lamborghini Urus 2023 · KA03KL2345', 'Reel', 'Completed', 'Aisha K.', 'Dhaval Editor', '2026-07-15', '2026-07-16', 0);
END
