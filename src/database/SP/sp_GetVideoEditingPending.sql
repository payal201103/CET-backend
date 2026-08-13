CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoEditingPending]
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
            isActive
        FROM dbo.video_editing_pending
        WHERE isActive = 1
        ORDER BY dueDate ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
