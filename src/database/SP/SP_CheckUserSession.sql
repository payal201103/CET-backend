-- SP_CheckUserSession
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_CheckUserSession]
(
    @userId BIGINT,
    @token VARCHAR(512)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        WITH LatestSession AS
        (
            SELECT TOP 1
                sm.*
            FROM session_master sm
            WHERE sm.userId = @userId
              AND sm.logoutType IS NULL
            ORDER BY sm.sessionId DESC
        )
        SELECT
            ls.userId,
            um.userName,
            um.entityId,
            um.roleId,
            rm.roleName,
            ls.token,
            ls.logoutType,
            ls.createdAt
        FROM LatestSession ls
        INNER JOIN user_master um ON um.userId = ls.userId
        INNER JOIN role_master rm ON rm.roleId = um.roleId
        WHERE um.isActive = 1
          AND rm.isActive = 1
          AND ls.token = @token;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
