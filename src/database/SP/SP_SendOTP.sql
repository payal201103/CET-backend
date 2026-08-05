-- SP_SendOTP
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_SendOTP]
(
    @userName VARCHAR(50),
    @schoolId BIGINT,
    @roleId INT,
    @ipAddress VARCHAR(25),
    @mobileNo VARCHAR(15) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @schoolManagement VARCHAR(100);
        DECLARE @userId BIGINT;
        DECLARE @otp VARCHAR(6);

        IF NOT EXISTS (
            SELECT 1
            FROM role_master
            WHERE roleId = @roleId
              AND isActive = 1
        )
        BEGIN
            RAISERROR('This role is inactive. OTP cannot be generated.', 16, 1);
            RETURN;
        END

        SELECT TOP 1
            @schoolManagement = sm.schoolManagementId
        FROM student_details sd
        INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
        WHERE sd.schoolId = @schoolId;

        IF @schoolManagement = 5
        BEGIN
            RAISERROR('Only government Principal login only.', 16, 1);
            RETURN;
        END

        SELECT @userId = userId
        FROM user_master
        WHERE userName = @userName;

        IF @userId IS NULL
        BEGIN
            INSERT INTO user_master
            (
                roleId, userName, entityId, mobileNo, isActive, createdAt, ipAddress
            )
            VALUES
            (
                @roleId, @userName, @userName, @mobileNo, 1, SYSDATETIME(), @ipAddress
            );

            SET @userId = SCOPE_IDENTITY();
        END

        SET @otp = '123456';

        INSERT INTO otp_logs
        (
            entityId, parentMo, otpCode, createdAt, ipAddress
        )
        VALUES
        (
            @userName, @mobileNo, @otp, SYSDATETIME(), @ipAddress
        );

        SELECT
            id AS otpId,
            @userName AS userName,
            @userId AS userId,
            @roleId AS roleId
        FROM otp_logs
        WHERE id = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
