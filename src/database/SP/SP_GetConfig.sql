-- SP_GetConfig
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetConfig]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            id,
            description,
            CASE WHEN value = 1 THEN 1 ELSE 0 END AS value
        FROM config;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
