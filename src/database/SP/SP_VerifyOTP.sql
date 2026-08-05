-- SP_VerifyOTP
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_VerifyOTP]
(
    @id INT,
    @userName BIGINT,
    @otpCode VARCHAR(10)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM otp_logs
            WHERE id = @id
              AND entityId = @userName
        )
        BEGIN
            RAISERROR('Invalid OTP request.', 16, 1);
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM otp_logs
            WHERE id = @id
              AND entityId = @userName
              AND DATEDIFF(MINUTE, createdAt, SYSDATETIME()) > 5
        )
        BEGIN
            RAISERROR('OTP expired. Please re-send new OTP.', 16, 1);
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM otp_logs
            WHERE id = @id
              AND entityId = @userName
              AND otpCode = @otpCode
        )
        BEGIN
            SELECT
                'OTP verified successfully.' AS message,
                userId
            FROM user_master
            WHERE userName = @userName;
        END
        ELSE
        BEGIN
            RAISERROR('Invalid OTP.', 16, 1);
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
