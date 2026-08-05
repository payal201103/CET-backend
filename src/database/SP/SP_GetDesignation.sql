-- SP_GetDesignation
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetDesignation]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT id, designationName
        FROM designation_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
