CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRequestsPending]
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
            p.id,
            p.jobCardNo,
            p.customerName,
            p.videoType,
            p.status,
            p.assignedBy,
            FORMAT(p.date, 'yyyy-MM-dd') AS date,
            p.isActive
        FROM dbo.video_requests_pending p
        INNER JOIN dbo.job_cards jc ON p.jobCardNo = jc.jobCardNo
        WHERE p.isActive = 1
          AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
        ORDER BY p.date DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
