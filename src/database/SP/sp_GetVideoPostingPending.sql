CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoPostingPending]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            id,
            jobCardNo,
            customerName,
            carDetails,
            videoType,
            status,
            videographer,
            FORMAT(dueDate, 'yyyy-MM-dd') AS dueDate,
            isActive
        FROM dbo.video_posting_pending
        WHERE isActive = 1
        ORDER BY dueDate ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
