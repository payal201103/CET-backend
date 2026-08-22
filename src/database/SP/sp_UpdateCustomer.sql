-- sp_UpdateCustomer
GO
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateCustomer]
(
    @Id INT,
    @CustomerName VARCHAR(150),
    @MobileNumber VARCHAR(15),
    @EmailId VARCHAR(100),
    @GstNumber VARCHAR(15),
    @UserId INT,
    @UserRole VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF @UserRole = 'Super Admin' OR @UserRole = 'Admin'
        BEGIN
            UPDATE customers
            SET name = @CustomerName,
                mobile = @MobileNumber,
                email = @EmailId,
                gstNumber = @GstNumber
            WHERE id = @Id;

            SELECT @@ROWCOUNT AS rowsUpdated;
        END
        ELSE
        BEGIN
            UPDATE customers
            SET name = @CustomerName,
                mobile = @MobileNumber,
                email = @EmailId,
                gstNumber = @GstNumber
            WHERE id = @Id
              AND createdBy = @UserId;

            SELECT @@ROWCOUNT AS rowsUpdated;
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
