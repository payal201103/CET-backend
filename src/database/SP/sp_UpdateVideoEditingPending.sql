CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateVideoEditingPending]
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @jobCardNo VARCHAR(50);
        DECLARE @customerName VARCHAR(150);
        DECLARE @carDetails VARCHAR(250);
        DECLARE @videoType VARCHAR(50);
        DECLARE @videographer VARCHAR(100);
        DECLARE @editor VARCHAR(100);
        DECLARE @dueDate DATETIME2(3);

        SELECT 
            @jobCardNo = jobCardNo,
            @customerName = customerName,
            @carDetails = carDetails,
            @videoType = videoType,
            @videographer = videographer,
            @editor = editor,
            @dueDate = dueDate
        FROM dbo.video_editing_pending
        WHERE id = @Id;

        IF @jobCardNo IS NULL
        BEGIN
            RAISERROR('Pending video editing request not found.', 16, 1);
            RETURN;
        END

        IF @IsActive = 0
        BEGIN
            -- Begin transaction to move record safely
            BEGIN TRANSACTION;

            -- Insert into completed table
            INSERT INTO dbo.video_editing_completed (
                id,
                jobCardNo,
                customerName,
                carDetails,
                videoType,
                status,
                videographer,
                editor,
                dueDate,
                completedDate,
                isActive,
                createdAt
            )
            VALUES (
                @Id,
                @jobCardNo,
                @customerName,
                @carDetails,
                @videoType,
                'Completed',
                @videographer,
                @editor,
                @dueDate,
                SYSDATETIME(),
                0,
                SYSDATETIME()
            );

            -- Delete from pending table
            DELETE FROM dbo.video_editing_pending
            WHERE id = @Id;

            COMMIT TRANSACTION;

            -- Return completed record details
            SELECT 
                @Id AS id,
                @jobCardNo AS jobCardNo,
                @customerName AS customerName,
                @carDetails AS carDetails,
                @videoType AS videoType,
                'Completed' AS status,
                @videographer AS videographer,
                @editor AS editor,
                FORMAT(@dueDate, 'yyyy-MM-dd') AS dueDate,
                FORMAT(SYSDATETIME(), 'yyyy-MM-dd') AS completedDate,
                0 AS isActive;
        END
        ELSE
        BEGIN
            -- Just return the current pending request as active
            SELECT 
                id,
                jobCardNo,
                customerName,
                carDetails,
                videoType,
                status,
                videographer,
                editor,
                FORMAT(dueDate, 'yyyy-MM-dd') AS dueDate,
                isActive
            FROM dbo.video_editing_pending
            WHERE id = @Id;
        END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
