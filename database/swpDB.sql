DROP DATABASE IF EXISTS Milk_Shop;
CREATE DATABASE Milk_Shop;
USE Milk_Shop;

CREATE TABLE BRAND (
    BrandID VARCHAR(10) NOT NULL PRIMARY KEY,
    Name NVARCHAR(30),
    Content NVARCHAR(100)
);

CREATE TABLE PRODUCT (
    ProductID VARCHAR(10) NOT NULL PRIMARY KEY,
    BrandID VARCHAR(10),
    Name NVARCHAR(30),
    Price INT NOT NULL,
    Expiration DATE,
    Quantity INT NOT NULL,
    Content TEXT,
    Status NVARCHAR(20),
    FOREIGN KEY (BrandID) REFERENCES BRAND(BrandID)
);

CREATE TABLE MEMBER (
    UserID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(20),
    Name NVARCHAR(30),
    RewardPoints INT NOT NULL,
    Email VARCHAR(50),
    Phone VARCHAR(15) NOT NULL,
    Address NVARCHAR(100)
);

CREATE TABLE STAFF (
    StaffID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(20),
    Name NVARCHAR(30),
    PhoneNumber VARCHAR(15) NOT NULL
);

CREATE TABLE ADMIN (
    AdminID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(20),
    Name NVARCHAR(30)
);

CREATE TABLE FEEDBACK (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    Rating INT NOT NULL,
    Content NVARCHAR(100),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE VOUCHER (
    VoucherID INT AUTO_INCREMENT PRIMARY KEY,
    Discount NVARCHAR(20),
    VoucherQuantity INT NOT NULL,
    Expiration DATE,
    Content NVARCHAR(100)
);

CREATE TABLE BLOG (
    BlogID VARCHAR(10) NOT NULL PRIMARY KEY,
    StaffID VARCHAR(10),
    CreatedDate DATE,
    Content TEXT,
    FOREIGN KEY (StaffID) REFERENCES STAFF(StaffID)
);

CREATE TABLE GUEST (
    GuestID INT AUTO_INCREMENT PRIMARY KEY,
    Name NVARCHAR(30),
    Email VARCHAR(50),
    Phone VARCHAR(15) NOT NULL,
    Address NVARCHAR(100)
);

CREATE TABLE WISHLIST (
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE CART (
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    CartQuantity INT NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE `ORDER` (
    OrderID VARCHAR(10) NOT NULL PRIMARY KEY,
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    GuestID INT,
    VoucherID INT,
    OrderQuantity INT NOT NULL,
    Status NVARCHAR(20),
    Tracking NVARCHAR(15),
    Payment NVARCHAR(20),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID),
    FOREIGN KEY (GuestID) REFERENCES GUEST(GuestID),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
);

INSERT INTO MEMBER (UserID, Password, Name, RewardPoints, Email, Phone, Address) VALUES
('U001', 'password1', 'John Doe', 100, 'john@email.com', '0987654321', 'Address 1'),
('U002', 'password2', 'Jane Smith', 50, 'jane@email.com', '0123456789', 'Address 2'),
('U003', 'password3', 'Bob Johnson', 200, 'bob@email.com', '0987612345', 'Address 3');

INSERT INTO BRAND (BrandID, Name, Content) VALUES
('B001', 'Brand A', 'Premium milk brand'),
('B002', 'Brand B', 'Organic milk products'),
('B003', 'Brand C', 'Local dairy farm');

INSERT INTO PRODUCT (ProductID, BrandID, Name, Price, Expiration, Quantity, Content, Status) VALUES
('P001', 'B001', 'Whole Milk', 3000, '2024-06-30', 100, 'Fresh whole milk', 'Available'),
('P002', 'B002', 'Low-Fat Milk', 2500, '2024-07-15', 80, 'Organic low-fat milk', 'Available'),
('P003', 'B003', 'Strawberry Yogurt', 4000, '2024-05-31', 50, 'Creamy strawberry yogurt', 'Out of Stock');

INSERT INTO ADMIN (AdminID, Password, Name) VALUES
('A001', 'admin123', 'John Smith');

INSERT INTO STAFF (StaffID, Password, Name, PhoneNumber) VALUES
('S001', 'staff123', 'Emily Johnson', '0123456789'),
('S002', 'staff456', 'Michael Brown', '0987654321'),
('S003', 'staff789', 'Sarah Davis', '0567891234');