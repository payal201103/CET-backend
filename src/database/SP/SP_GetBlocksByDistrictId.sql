-- SP_GetBlocksByDistrictId
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetBlocksByDistrictId]
(
    @districtId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT blockId, blockName
        FROM block_master
        WHERE districtId = @districtId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
