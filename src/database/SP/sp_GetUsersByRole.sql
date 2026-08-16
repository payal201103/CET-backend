CREATE OR ALTER PROCEDURE [dbo].[sp_GetUsersByRole]
    @UserRole VARCHAR(50),
    @CurrentUserId INT,
    @BranchId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @CurrentUserId;

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
            userID as id, 
            Firstname as firstName, 
            Lastname as lastName, 
            username, 
            role,
            branchId
        FROM dbo.users
        WHERE (@EffectiveBranchId IS NULL OR branchId = @EffectiveBranchId)
        ORDER BY userID DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
