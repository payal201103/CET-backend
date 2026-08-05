-- SP_GetCaste
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetCaste]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT categoryId, casteName
        FROM caste_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
