-- Video Requests Migration: Tables setup
-- 1. rejected_video_requests table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'rejected_video_requests' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.rejected_video_requests (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        carDetails VARCHAR(250) NOT NULL,
        services VARCHAR(1000) NOT NULL,
        videographerName VARCHAR(100) NOT NULL,
        rejectedDate DATETIME2(3) DEFAULT SYSDATETIME(),
        rejectionReason VARCHAR(MAX) NULL,
        isResolved BIT DEFAULT 0,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- 2. video_requests_pending table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_requests_pending' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_requests_pending (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        videoType VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        assignedBy VARCHAR(100) NOT NULL,
        date DATETIME2(3) DEFAULT SYSDATETIME(),
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END

-- 3. video_requests_completed table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'video_requests_completed' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.video_requests_completed (
        id INT NOT NULL PRIMARY KEY, -- Matches the ID from video_requests_pending
        jobCardNo VARCHAR(50) NOT NULL,
        customerName VARCHAR(150) NOT NULL,
        videoType VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Completed',
        assignedBy VARCHAR(100) NOT NULL,
        date DATETIME2(3) NOT NULL, -- Original pending date
        completedDate DATETIME2(3) DEFAULT SYSDATETIME(),
        isActive BIT NOT NULL DEFAULT 0,
        createdAt DATETIME2(3) DEFAULT SYSDATETIME(),
        updatedAt DATETIME2(3) NULL
    );
END
