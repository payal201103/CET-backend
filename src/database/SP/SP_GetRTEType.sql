-- SP_GetRTEType
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetRTEType]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT rteType, rteTypeName
        FROM rte_type_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
