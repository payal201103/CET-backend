CREATE OR ALTER PROCEDURE [dbo].[sp_GetRejectedVideoRequests]
(
    @UserId INT,
    @UserRole VARCHAR(50),
    @BranchId INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @UserId;

        DECLARE @EffectiveBranchId INT;
        IF @UserActualRole = 'Super Admin'
        BEGIN
            SET @EffectiveBranchId = @BranchId;
        END
        ELSE
        BEGIN
            SET @EffectiveBranchId = @UserBranchId;
        END

        SELECT 
            r.id,
            r.jobCardNo,
            r.customerName,
            r.carDetails,
            r.services,
            r.videographerName,
            FORMAT(r.rejectedDate, 'yyyy-MM-dd') AS rejectedDate,
            r.rejectionReason,
            r.isResolved
        FROM dbo.rejected_video_requests r
        INNER JOIN dbo.job_cards jc ON r.jobCardNo = jc.jobCardNo
        WHERE r.isResolved = 0
          AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
        ORDER BY r.rejectedDate DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
