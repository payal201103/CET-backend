-- SP_DpeoApproverResetPassword
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_DpeoApproverResetPassword]
(
    @userId INT,
    @password VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM user_master
            WHERE userId = @userId
        )
        BEGIN
            RAISERROR('User not found.', 16, 1);
            RETURN;
        END

        UPDATE user_master
        SET
            password = @password,
            updatedAt = SYSDATETIME()
        WHERE userId = @userId;

        SELECT 'Password updated successfully.' AS message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
