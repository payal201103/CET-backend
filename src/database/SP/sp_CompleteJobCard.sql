-- sp_CompleteJobCard: creator (createdBy = @UserId) or Super Admin may complete a job card
GO
CREATE OR ALTER PROCEDURE [dbo].[sp_CompleteJobCard]
(
    @Id INT,
    @UserId INT,
    @UserRole VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @createdBy INT;
        DECLARE @isCompleted BIT;

        SELECT
            @createdBy = createdBy,
            @isCompleted = isCompleted
        FROM job_cards
        WHERE id = @Id;

        IF @createdBy IS NULL
        BEGIN
            RAISERROR('Job card not found.', 16, 1);
            RETURN;
        END

        IF @UserRole <> 'Super Admin' AND @createdBy <> @UserId
        BEGIN
            RAISERROR('You are not authorized to complete this job card.', 16, 1);
            RETURN;
        END

        IF @isCompleted = 1
        BEGIN
            RAISERROR('Job card is already completed.', 16, 1);
            RETURN;
        END

        UPDATE job_cards
        SET isCompleted = 1,
            status = 'Completed',
            updatedAt = SYSDATETIME()
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
