-- SP_GetVillageByBlockId
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetVillageByBlockId]
(
    @blockId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT villageId, villageName
        FROM village_master
        WHERE blockId = @blockId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
