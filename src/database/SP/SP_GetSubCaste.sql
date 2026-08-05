-- SP_GetSubCaste
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetSubCaste]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT subCategoryId, subCasteName
        FROM sub_caste_master;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
