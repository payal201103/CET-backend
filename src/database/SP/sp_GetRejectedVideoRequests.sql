CREATE OR ALTER PROCEDURE [dbo].[sp_GetRejectedVideoRequests]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            id,
            jobCardNo,
            customerName,
            carDetails,
            services,
            videographerName,
            FORMAT(rejectedDate, 'yyyy-MM-dd') AS rejectedDate,
            rejectionReason,
            isResolved
        FROM dbo.rejected_video_requests
        WHERE isResolved = 0
        ORDER BY rejectedDate DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
