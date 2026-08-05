-- SP_UpsertStudentChoiceFilling
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpsertStudentChoiceFilling]
(
    @childUID BIGINT,
    @schoolList NVARCHAR(MAX),
    @roundNo INT,
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS (
            SELECT 1
            FROM config
            WHERE id = 'CHOICE_FILLING'
              AND value = 0
        )
        BEGIN
            RAISERROR('Choice filling has been closed by the admin.', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM student_details WHERE childUID = @childUID)
        BEGIN
            RAISERROR('Invalid ChildUID', 16, 1);
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM student_choice_filling_master
            WHERE childUID = @childUID
              AND roundNo = @roundNo
              AND isDeleted = 0
        )
        BEGIN
            RAISERROR('Choice filling already submitted for this round.', 16, 1);
            RETURN;
        END

        INSERT INTO student_choice_filling_master
        (
            childUID, schoolId, priority, roundNo, ipAddress
        )
        SELECT
            @childUID, schoolId, priority, @roundNo, @ipAddress
        FROM OPENJSON(@schoolList)
        WITH
        (
            schoolId BIGINT, priority INT
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
