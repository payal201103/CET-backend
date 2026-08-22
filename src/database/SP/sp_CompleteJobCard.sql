CREATE OR ALTER PROCEDURE [dbo].[sp_CompleteJobCard]
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
        DECLARE @createdBy INT;
        DECLARE @isCompleted BIT;
        DECLARE @cardBranchId INT;

        SELECT
            @createdBy = createdBy,
            @isCompleted = isCompleted,
            @cardBranchId = branchId
        FROM dbo.job_cards
        WHERE id = @Id;

        IF @createdBy IS NULL
        BEGIN
            RAISERROR('Job card not found.', 16, 1);
            RETURN;
        END

        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @UserId;

        IF @UserActualRole <> 'Super Admin'
        BEGIN
            IF @cardBranchId <> @UserBranchId
            BEGIN
                RAISERROR('You are not authorized to complete job cards from another branch.', 16, 1);
                RETURN;
            END

            DECLARE @CreatorRole VARCHAR(50);
            SELECT @CreatorRole = role FROM dbo.users WHERE userID = @createdBy;

            IF @UserActualRole <> 'Admin' AND @UserActualRole <> @CreatorRole
            BEGIN
                RAISERROR('You are not authorized to complete this job card.', 16, 1);
                RETURN;
            END
        END

        IF @isCompleted = 1
        BEGIN
            RAISERROR('Job card is already completed.', 16, 1);
            RETURN;
        END

        UPDATE dbo.job_cards
        SET isCompleted = 1,
            status = 'Completed'
        WHERE id = @Id;

        SELECT
            @Id AS id,
            'Completed' AS status;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
