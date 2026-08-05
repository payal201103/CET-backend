-- SP_StudentARStatus
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_StudentARStatus]
(
    @childUID BIGINT,
    @approverId BIGINT,
    @section1 INT = NULL,
    @section1RejectedReason NVARCHAR(1000) = NULL,
    @section2 INT = NULL,
    @section2RejectedReason NVARCHAR(1000) = NULL,
    @section3 INT = NULL,
    @section3RejectedReason NVARCHAR(1000) = NULL,
    @section4 INT = NULL,
    @section4RejectedReason NVARCHAR(1000) = NULL,
    @ipAddress VARCHAR(25) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @currentApproved INT;
        DECLARE @currentRegistered INT;

        -- Lock row and read current state
        SELECT
            @currentApproved = isApproved,
            @currentRegistered = isRegistered
        FROM student_details WITH (UPDLOCK, HOLDLOCK, ROWLOCK)
        WHERE childUID = @childUID;

        IF @currentRegistered = 0
        BEGIN
            RAISERROR('Form already rejected / submitted.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @currentApproved = 1
        BEGIN
            RAISERROR('Form already approved.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        INSERT INTO student_approval_status_master
        (
            childUID, approverId,
            section1, section1RejectedReason,
            section2, section2RejectedReason,
            section3, section3RejectedReason,
            section4, section4RejectedReason,
            ipAddress
        )
        VALUES
        (
            @childUID, @approverId,
            @section1, @section1RejectedReason,
            @section2, @section2RejectedReason,
            @section3, @section3RejectedReason,
            @section4, @section4RejectedReason,
            @ipAddress
        );

        IF (
            @section1 = 0 OR @section2 = 0 OR @section3 = 0 OR @section4 = 0
        )
        BEGIN
            UPDATE student_details
            SET isApproved = 0,
                isRegistered = 0
            WHERE childUID = @childUID;
        END
        ELSE
        BEGIN
            UPDATE student_details
            SET isApproved = 1
            WHERE childUID = @childUID;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
