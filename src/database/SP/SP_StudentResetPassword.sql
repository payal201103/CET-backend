-- SP_StudentResetPassword
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_StudentResetPassword]
(
    @userName BIGINT,
    @password VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM user_master
            WHERE userName = @userName
        )
        BEGIN
            RAISERROR('User not found.', 16, 1);
            RETURN;
        END

        UPDATE user_master
        SET
            password = @password,
            updatedAt = SYSDATETIME()
        WHERE userName = @userName;

        SELECT 'Password updated successfully.' AS message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
