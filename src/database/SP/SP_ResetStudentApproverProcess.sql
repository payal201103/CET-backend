-- SP_ResetStudentApproverProcess
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_ResetStudentApproverProcess]
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
            RAISERROR('Student not found.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM student_approval_status_master
            WHERE childUID = @childUID
              AND isDeleted = 1
        )
        BEGIN
            RAISERROR('Approver already reset.', 16, 1);
            ROLLBACK TRANSACTION;
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
            RAISERROR('Please reset choice filling first.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE student_approval_status_master
        SET isDeleted = 1
        WHERE childUID = @childUID
          AND isDeleted = 0;

        UPDATE student_details
        SET isApproved = NULL
        WHERE childUID = @childUID;

        INSERT INTO student_reset_logs
        (
            childUID, userId, resetType, resetReason, ipAddress
        )
        VALUES
        (
            @childUID, @userId, 'APPROVER_RESET', @resetReason, @ipAddress
        );

        COMMIT TRANSACTION;

        SELECT 'Student approver process reset successfully.' AS message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
