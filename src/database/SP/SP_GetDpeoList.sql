-- SP_GetDpeoList
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetDpeoList]
(
    @page INT = 0,
    @limit INT = 10,
    @search VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @sql NVARCHAR(MAX);
        DECLARE @countSql NVARCHAR(MAX);
        DECLARE @whereClause NVARCHAR(MAX) = '';
        DECLARE @paginationClause NVARCHAR(MAX) = '';
        DECLARE @params NVARCHAR(MAX);

        SET @whereClause = ' WHERE um.roleId = 4 ';

        IF @search IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + '
                AND (
                    um.userName LIKE @search + ''%''
                    OR CAST(um.entityId AS VARCHAR) LIKE @search + ''%''
                    OR DM.districtName LIKE @search + ''%''
                )';
        END

        IF @page IS NOT NULL AND @limit IS NOT NULL
        BEGIN
            SET @paginationClause = '
                ORDER BY DM.districtName ASC OFFSET (@page * @limit) ROWS FETCH NEXT @limit ROWS ONLY';
        END
        ELSE
        BEGIN
            SET @paginationClause = ' ORDER BY DM.districtName ASC';
        END

        SET @sql = N'
            SELECT
                CAST(um.userId AS INT) AS userId,
                um.userName,
                um.entityId,
                DM.districtName
            FROM user_master um
            LEFT JOIN district_master DM
                ON um.entityId = DM.districtId'
            + @whereClause
            + @paginationClause;

        SET @countSql = N'
            SELECT COUNT(um.userId) AS total
            FROM user_master um
            LEFT JOIN district_master DM
                ON um.entityId = DM.districtId'
            + @whereClause;

        SET @params = N'
            @page INT,
            @limit INT,
            @search VARCHAR(100)';

        EXEC sp_executesql
            @sql, @params, @page, @limit, @search;

        EXEC sp_executesql
            @countSql, @params, @page, @limit, @search;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
