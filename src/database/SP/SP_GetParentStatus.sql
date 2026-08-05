-- SP_GetParentStatus
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetParentStatus]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT psId, statusName
        FROM parent_status_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
