CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteJobCard]
(
    @Id INT,
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

        IF @UserActualRole <> 'Super Admin'
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM dbo.job_cards WHERE id = @Id AND branchId = @UserBranchId)
            BEGIN
                RAISERROR('You are not authorized to delete this job card.', 16, 1);
                RETURN;
            END
        END

        DELETE FROM dbo.job_cards WHERE id = @Id;

        SELECT @Id AS id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
