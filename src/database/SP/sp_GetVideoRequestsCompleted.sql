CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRequestsCompleted]
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
            c.id,
            c.jobCardNo,
            c.customerName,
            c.videoType,
            c.status,
            c.assignedBy,
            FORMAT(c.date, 'yyyy-MM-dd') AS date,
            FORMAT(c.completedDate, 'yyyy-MM-dd') AS completedDate,
            c.isActive
        FROM dbo.video_requests_completed c
        INNER JOIN dbo.job_cards jc ON c.jobCardNo = jc.jobCardNo
        WHERE c.isActive = 0
          AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
        ORDER BY c.completedDate DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
