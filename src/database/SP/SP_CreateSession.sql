-- SP_CreateSession
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_CreateSession]
(
    @userId BIGINT,
    @token VARCHAR(512),
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        INSERT INTO session_master
        (
            userId, token, createdAt, updatedAt, ipAddress
        )
        VALUES
        (
            @userId, @token, SYSDATETIME(), SYSDATETIME(), @ipAddress
        );

        SELECT
            CAST(UM.userId AS INT) AS userId,
            UM.roleId,
            UM.userName,
            UM.entityId,
            SM.token
        FROM user_master UM
        INNER JOIN session_master SM
            ON UM.userId = SM.userId
        WHERE UM.userId = @userId
          AND SM.token = @token;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
