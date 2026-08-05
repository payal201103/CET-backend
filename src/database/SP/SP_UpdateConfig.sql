-- SP_UpdateConfig
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpdateConfig]
(
    @id VARCHAR(20),
    @value INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE config
        SET
            @value = @value,
            updatedAt = SYSDATETIME()
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
