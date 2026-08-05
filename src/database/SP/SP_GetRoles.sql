-- SP_GetRoles
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetRoles]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            roleId,
            roleName,
            CASE WHEN isActive = 1 THEN 1 ELSE 0 END AS isActive
        FROM role_master
        WHERE roleId <> 1
        ORDER BY roleId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
