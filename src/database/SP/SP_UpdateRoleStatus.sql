-- SP_UpdateRoleStatus
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpdateRoleStatus]
(
    @roleId INT,
    @isActive INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE role_master
        SET
            isActive = @isActive,
            updatedAt = SYSDATETIME()
        WHERE roleId = @roleId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
