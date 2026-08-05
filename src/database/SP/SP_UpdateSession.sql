-- SP_UpdateSession
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpdateSession]
(
    @userId BIGINT,
    @token VARCHAR(512)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE session_master
        SET
            logoutType = 'Logout',
            updatedAt = SYSDATETIME()
        WHERE userId = @userId
          AND token = @token
          AND logoutType IS NULL;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
