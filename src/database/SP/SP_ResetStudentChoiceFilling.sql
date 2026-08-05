-- SP_ResetStudentChoiceFilling
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_ResetStudentChoiceFilling]
(
    @childUID BIGINT,
    @userId INT,
    @roundNo INT,
    @resetReason NVARCHAR(500),
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (
            SELECT 1
            FROM student_details WITH (UPDLOCK, HOLDLOCK)
            WHERE childUID = @childUID
        )
        BEGIN
            RAISERROR('Invalid ChildUID', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM student_choice_filling_master
            WHERE childUID = @childUID AND roundNo = @roundNo AND isDeleted = 0
        )
        BEGIN
            RAISERROR('Choice filling not found.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE student_choice_filling_master
        SET isDeleted = 1
        WHERE childUID = @childUID
          AND roundNo = @roundNo
          AND isDeleted = 0;

        INSERT INTO student_reset_logs
        (
            childUID, userId, resetType, resetReason, ipAddress
        )
        VALUES
        (
            @childUID, @userId, 'CHOICE_FILLING_RESET', @resetReason, @ipAddress
        );

        COMMIT TRANSACTION;

        SELECT 'Student choice filling reset successfully.' AS message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
