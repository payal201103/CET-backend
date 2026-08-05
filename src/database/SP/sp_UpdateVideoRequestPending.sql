CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateVideoRequestPending]
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
        DECLARE @videoType VARCHAR(50);
        DECLARE @assignedBy VARCHAR(100);
        DECLARE @date DATETIME2(3);

        SELECT 
            @jobCardNo = jobCardNo,
            @customerName = customerName,
            @videoType = videoType,
            @assignedBy = assignedBy,
            @date = date
        FROM dbo.video_requests_pending
        WHERE id = @Id;

        IF @jobCardNo IS NULL
        BEGIN
            RAISERROR('Pending video request not found.', 16, 1);
            RETURN;
        END

        IF @IsActive = 0
        BEGIN
            -- Begin transaction to move record safely
            BEGIN TRANSACTION;

            -- Insert into completed table
            INSERT INTO dbo.video_requests_completed (
                id,
                jobCardNo,
                customerName,
                videoType,
                status,
                assignedBy,
                date,
                completedDate,
                isActive,
                createdAt
            )
            VALUES (
                @Id,
                @jobCardNo,
                @customerName,
                @videoType,
                'Completed',
                @assignedBy,
                @date,
                SYSDATETIME(),
                0,
                SYSDATETIME()
            );

            -- Delete from pending table
            DELETE FROM dbo.video_requests_pending
            WHERE id = @Id;

            COMMIT TRANSACTION;

            -- Return completed record details
            SELECT 
                @Id AS id,
                @jobCardNo AS jobCardNo,
                @customerName AS customerName,
                @videoType AS videoType,
                'Completed' AS status,
                @assignedBy AS assignedBy,
                FORMAT(@date, 'yyyy-MM-dd') AS date,
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
                videoType,
                status,
                assignedBy,
                FORMAT(date, 'yyyy-MM-dd') AS date,
                isActive
            FROM dbo.video_requests_pending
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
