CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateJobCard]
    @Id INT,
    @BrandId INT,
    @ModelId INT,
    @CarNumber VARCHAR(50),
    @CarColor VARCHAR(50),
    @Services VARCHAR(1000),
    @BookingDate DATETIME,
    @DeliveryDate DATETIME,
    @SpecialNotes VARCHAR(MAX),
    @Status VARCHAR(50),
    @UserId INT,
    @UserRole VARCHAR(50),
    @BranchId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @UserId;

        IF @UserActualRole <> 'Super Admin'
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM dbo.job_cards WHERE id = @Id AND branchId = @UserBranchId)
            BEGIN
                RAISERROR('You are not authorized to update this job card.', 16, 1);
                RETURN;
            END
        END

        UPDATE dbo.job_cards
        SET brandId = @BrandId,
            modelId = @ModelId,
            carNumber = @CarNumber,
            carColor = @CarColor,
            services = @Services,
            bookingDate = @BookingDate,
            deliveryDate = @DeliveryDate,
            specialNotes = @SpecialNotes,
            status = @Status,
            updatedAt = SYSDATETIME()
        WHERE id = @Id;

        SELECT @Id as id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
