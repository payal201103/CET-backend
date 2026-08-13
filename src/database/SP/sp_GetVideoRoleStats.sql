CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRoleStats]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Create Temp Table for Videographer stats
        CREATE TABLE #VideographerCombined (
            [name] VARCHAR(100),
            active INT DEFAULT 0,
            done INT DEFAULT 0
        );

        -- Insert active counts for videographers
        INSERT INTO #VideographerCombined ([name], active)
        SELECT 
            assignedBy,
            COUNT(*)
        FROM dbo.video_requests_pending
        GROUP BY assignedBy;

        -- Insert completed counts for videographers
        -- Merge with existing or insert new
        MERGE #VideographerCombined AS target
        USING (
            SELECT 
                assignedBy,
                COUNT(*) AS done_count
            FROM dbo.video_requests_completed
            GROUP BY assignedBy
        ) AS source
        ON target.[name] = source.assignedBy
        WHEN MATCHED THEN
            UPDATE SET target.done = source.done_count
        WHEN NOT MATCHED THEN
            INSERT ([name], active, done)
            VALUES (source.assignedBy, 0, source.done_count);

        -- Select Videographer stats
        SELECT [name], active, done FROM #VideographerCombined ORDER BY [name];

        -- Create Temp Table for Editor stats
        CREATE TABLE #EditorCombined (
            [name] VARCHAR(100),
            active INT DEFAULT 0,
            done INT DEFAULT 0
        );

        -- Insert active counts for editors
        INSERT INTO #EditorCombined ([name], active)
        SELECT 
            editor,
            COUNT(*)
        FROM dbo.video_editing_pending
        WHERE editor IS NOT NULL AND editor <> ''
        GROUP BY editor;

        -- Insert completed counts for editors
        MERGE #EditorCombined AS target
        USING (
            SELECT 
                editor,
                COUNT(*) AS done_count
            FROM dbo.video_editing_completed
            WHERE editor IS NOT NULL AND editor <> ''
            GROUP BY editor
        ) AS source
        ON target.[name] = source.editor
        WHEN MATCHED THEN
            UPDATE SET target.done = source.done_count
        WHEN NOT MATCHED THEN
            INSERT ([name], active, done)
            VALUES (source.editor, 0, source.done_count);

        -- Select Editor stats
        SELECT [name], active, done FROM #EditorCombined ORDER BY [name];

        -- Cleanup
        DROP TABLE #VideographerCombined;
        DROP TABLE #EditorCombined;
    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#VideographerCombined') IS NOT NULL
            DROP TABLE #VideographerCombined;
        IF OBJECT_ID('tempdb..#EditorCombined') IS NOT NULL
            DROP TABLE #EditorCombined;
        THROW;
    END CATCH
END;
GO
