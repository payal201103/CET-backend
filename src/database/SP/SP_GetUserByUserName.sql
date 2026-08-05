-- SP_GetUserByUserName
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetUserByUserName]
(
    @userName VARCHAR(50),
    @roleId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @userId INT, @entityId BIGINT, @mobileNo VARCHAR(255), @password VARCHAR(255);

        IF NOT EXISTS (
            SELECT 1
            FROM role_master
            WHERE roleId = @roleId
              AND isActive = 1
        )
        BEGIN
            SELECT 'This role is inactive. Login not allowed.' AS message;
            RETURN;
        END

        SELECT
            @userId = userId,
            @entityId = entityId,
            @mobileNo = mobileNo,
            @password = password
        FROM user_master
        WHERE userName = @userName
          AND roleId = @roleId
          AND isActive = 1;

        IF @userId IS NULL
        BEGIN
            SELECT 'User not found.' AS message;
            RETURN;
        END

        IF @roleId = 3
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM config
                WHERE id = 'CHOICE_FILLING'
                  AND value = 0
            )
            BEGIN
                RAISERROR('Choice filling is currently closed. Login is not allowed.', 16, 1);
                RETURN;
            END

            IF NOT EXISTS (
                SELECT 1
                FROM student_details
                WHERE childUID = @userName
                  AND isRegistered = 1
                  AND isApproved = 1
            )
            BEGIN
                SELECT 'Login allowed only after approval.' AS message;
                RETURN;
            END
        END

        SELECT
            @userId AS userId,
            @userName AS userName,
            @entityId AS entityId,
            @mobileNo AS mobileNo,
            @password AS password;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
