CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoEditingCompleted]
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
            editor,
            FORMAT(dueDate, 'yyyy-MM-dd') AS dueDate,
            FORMAT(completedDate, 'yyyy-MM-dd') AS completedDate,
            isActive
        FROM dbo.video_editing_completed
        WHERE isActive = 0
        ORDER BY completedDate DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
