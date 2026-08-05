CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRequestsCompleted]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            id,
            jobCardNo,
            customerName,
            videoType,
            status,
            assignedBy,
            FORMAT(date, 'yyyy-MM-dd') AS date,
            FORMAT(completedDate, 'yyyy-MM-dd') AS completedDate,
            isActive
        FROM dbo.video_requests_completed
        ORDER BY completedDate DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
