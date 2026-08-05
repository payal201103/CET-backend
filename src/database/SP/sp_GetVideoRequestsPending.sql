CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRequestsPending]
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
            isActive
        FROM dbo.video_requests_pending
        WHERE isActive = 1
        ORDER BY date DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
