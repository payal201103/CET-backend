-- SP_StudentSendOTP
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_StudentSendOTP]
(
    @childUID BIGINT,
    @parentMo VARCHAR(10),
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @otp VARCHAR(6);

        IF NOT EXISTS (SELECT 1 FROM student_details WHERE childUID = @childUID)
        BEGIN
            RAISERROR('Student not found.', 16, 1);
            RETURN;
        END

        SET @otp = '123456';

        INSERT INTO otp_logs
        (
            entityId, parentMo, otpCode, createdAt, ipAddress
        )
        VALUES
        (
            @childUID, @parentMo, @otp, SYSDATETIME(), @ipAddress
        );

        SELECT
            id AS otpId,
            @childUID AS entityId
        FROM otp_logs
        WHERE id = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
