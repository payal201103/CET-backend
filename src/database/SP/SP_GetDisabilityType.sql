-- SP_GetDisabilityType
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetDisabilityType]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT disabilityId, disabilityName
        FROM disability_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
