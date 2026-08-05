-- SP_GetDistricts
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetDistricts]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT districtId, districtName
        FROM district_master
        WHERE stateId = 24
        ORDER BY districtName ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
