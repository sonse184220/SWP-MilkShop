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
    Name NVARCHAR(100),
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
('P003', 'B003', 'Strawberry Yogurt', 4000, '2024-05-31', 50, 'Creamy strawberry yogurt', 'Out of Stock'),
('P004', 'B001', 'Milk A', 200, '2025-12-31', 100, 'Fresh milk A', 'Available'),
('P005', 'B001', 'Milk B', 220, '2025-12-31', 150, 'Fresh milk B', 'Available'),
('P006', 'B001', 'Milk C', 210, '2025-12-31', 120, 'Fresh milk C', 'Available'),
('P007', 'B001', 'Yogurt A', 300, '2025-12-31', 80, 'Fresh yogurt A', 'Available'),
('P008', 'B001', 'Yogurt B', 320, '2025-12-31', 90, 'Fresh yogurt B', 'Available'),
('P009', 'B001', 'Cheese A', 500, '2025-12-31', 50, 'Fresh cheese A', 'Available'),
('P010', 'B001', 'Cheese B', 550, '2025-12-31', 60, 'Fresh cheese B', 'Available'),
('P011', 'B001', 'Butter A', 400, '2025-12-31', 70, 'Fresh butter A', 'Available'),
('P012', 'B001', 'Butter B', 420, '2025-12-31', 75, 'Fresh butter B', 'Available'),
('P013', 'B001', 'Cream A', 350, '2025-12-31', 85, 'Fresh cream A', 'Available'),
('P014', 'B001', 'Cream B', 370, '2025-12-31', 65, 'Fresh cream B', 'Available'),
('P015', 'B001', 'Milk D', 230, '2025-12-31', 130, 'Fresh milk D', 'Available'),
('P016', 'B001', 'Milk E', 240, '2025-12-31', 140, 'Fresh milk E', 'Available'),
('P017', 'B001', 'Yogurt C', 340, '2025-12-31', 95, 'Fresh yogurt C', 'Available'),
('P018', 'B001', 'Yogurt D', 360, '2025-12-31', 100, 'Fresh yogurt D', 'Available'),
('P019', 'B001', 'Cheese C', 600, '2025-12-31', 55, 'Fresh cheese C', 'Available'),
('P020', 'B001', 'Cheese D', 650, '2025-12-31', 65, 'Fresh cheese D', 'Available'),
('P021', 'B001', 'Butter C', 450, '2025-12-31', 70, 'Fresh butter C', 'Available'),
('P022', 'B001', 'Butter D', 470, '2025-12-31', 80, 'Fresh butter D', 'Available'),
('P023', 'B001', 'Cream C', 380, '2025-12-31', 90, 'Fresh cream C', 'Available'),
('P024', 'B001', 'Cream D', 400, '2025-12-31', 95, 'Fresh cream D', 'Available'),
('P025', 'B001', 'Milk F', 250, '2025-12-31', 145, 'Fresh milk F', 'Available'),
('P026', 'B001', 'Milk G', 260, '2025-12-31', 155, 'Fresh milk G', 'Available'),
('P027', 'B001', 'Yogurt E', 380, '2025-12-31', 105, 'Fresh yogurt E', 'Available'),
('P028', 'B001', 'Yogurt F', 400, '2025-12-31', 110, 'Fresh yogurt F', 'Available'),
('P029', 'B001', 'Cheese E', 700, '2025-12-31', 75, 'Fresh cheese E', 'Available'),
('P030', 'B001', 'Cheese F', 750, '2025-12-31', 80, 'Fresh cheese F', 'Available');

INSERT INTO ADMIN (AdminID, Password, Name) VALUES
('A001', 'admin123', 'John Smith');

INSERT INTO STAFF (StaffID, Password, Name, PhoneNumber) VALUES
('S001', 'staff123', 'Emily Johnson', '0123456789'),
('S002', 'staff456', 'Michael Brown', '0987654321'),
('S003', 'staff789', 'Sarah Davis', '0567891234');

INSERT INTO BLOG (BlogID, StaffID, Name, CreatedDate, Content) VALUES 
('BLOG001', 'S001', 'The Magic of Milk', '2024-05-24', 'Milk has been a staple in diets for centuries, providing essential nutrients like calcium and vitamin D.'),
('BLOG002', 'S001', 'Exploring Dairy Products', '2024-05-24', 'From creamy cheeses to rich yogurts, dairy products offer a diverse range of flavors and textures.'),
('BLOG003', 'S001', 'Health Benefits of Milk', '2024-05-24', 'Drinking milk can promote bone health and reduce the risk of osteoporosis.'),
('BLOG004', 'S001', 'The Art of Cheese Making', '2024-05-24', 'Discover the fascinating process behind crafting delicious cheeses from milk.'),
('BLOG005', 'S001', 'Yogurt: A Probiotic Powerhouse', '2024-05-24', 'Learn about the gut-boosting benefits of yogurt and its role in digestive health.'),
('BLOG006', 'S001', 'Cooking with Dairy', '2024-05-24', 'Explore creative recipes featuring dairy ingredients, from creamy pasta sauces to decadent desserts.'),
('BLOG007', 'S001', 'The History of Milk Production', '2024-05-24', 'Trace the evolution of dairy farming practices and their impact on society.'),
('BLOG008', 'S001', 'Milk Alternatives: Exploring Options', '2024-05-24', 'Discover plant-based alternatives to traditional dairy products, such as almond milk and soy milk.'),
('BLOG009', 'S001', 'Caring for Dairy Cows', '2024-05-24', 'Learn about the importance of animal welfare in dairy farming and sustainable practices for raising healthy cows.'),
('BLOG010', 'S001', 'The Science of Milk Processing', '2024-05-24', 'Explore the intricate processes involved in pasteurizing and homogenizing milk for consumption.'),
('BLOG011', 'S001', 'Milk in Cultural Traditions', '2024-05-24', 'Discover how milk has been revered and incorporated into various cultural ceremonies and rituals worldwide.'),
('BLOG012', 'S001', 'The Future of Dairy Technology', '2024-05-24', 'Explore innovative advancements in dairy technology, from robotic milking systems to smart farming.'),
('BLOG013', 'S001', 'Milk Myths Debunked', '2024-05-24', 'Separate fact from fiction as we debunk common myths surrounding milk consumption and health.'),
('BLOG014', 'S001', 'Cheese Pairing Guide', '2024-05-24', 'Unlock the secrets to perfect cheese pairings with wine, fruit, and other complementary flavors.'),
('BLOG015', 'S001', 'Benefits of Organic Dairy', '2024-05-24', 'Discover the advantages of choosing organic dairy products, including improved animal welfare and environmental sustainability.'),
('BLOG016', 'S001', 'Milk and Weight Management', '2024-05-24', 'Learn how incorporating milk into your diet can support weight loss and healthy weight management.'),
('BLOG017', 'S001', 'Dairy-Free Dessert Recipes', '2024-05-24', 'Indulge your sweet tooth with these delicious dairy-free dessert recipes, perfect for lactose intolerant individuals or vegans.'),
('BLOG018', 'S001', 'The Nutritional Value of Dairy', '2024-05-24', 'Explore the essential nutrients found in dairy products and their role in maintaining overall health and well-being.'),
('BLOG019', 'S001', 'Milk and Bone Health', '2024-05-24', 'Discover how calcium-rich milk can contribute to strong bones and prevent conditions like osteoporosis.'),
('BLOG020', 'S001', 'Dairy Farming Sustainability', '2024-05-24', 'Learn about efforts to promote sustainable dairy farming practices and reduce the environmental impact of milk production.'),
('BLOG021', 'S001', 'Milkshake Madness', '2024-05-24', 'Indulge in the creamy goodness of homemade milkshakes with these irresistible recipes.'),
('BLOG022', 'S001', 'Dairy in Art and Literature', '2024-05-24', 'Explore the depiction of milk and dairy products in paintings, poems, and novels throughout history.'),
('BLOG023', 'S001', 'The Global Dairy Industry', '2024-05-24', 'Learn about the economic impact and global reach of the dairy industry, from small-scale farms to multinational corporations.'),
('BLOG024', 'S001', 'Milk: A Versatile Ingredient', '2024-05-24', 'Discover the endless culinary possibilities of milk, from enriching sauces to tenderizing meats.'),
('BLOG025', 'S001', 'The Dairy-Free Movement', '2024-05-24', 'Explore the growing trend of dairy-free diets and the wide range of alternatives available to consumers today.'),
('BLOG026', 'S001', 'Milk Production Challenges', '2024-05-24', 'Examine the obstacles facing dairy farmers, including environmental concerns, market fluctuations, and animal welfare issues.'),
('BLOG027', 'S001', 'The Benefits of Greek Yogurt', '2024-05-24', 'Discover the nutritional advantages of Greek yogurt and its creamy texture, perfect for breakfast or as a healthy snack.'),
('BLOG028', 'S001', 'Milk and Mental Health', '2024-05-24', 'Learn about the potential link between milk consumption and improved mood, cognitive function, and overall mental well-being.'),
('BLOG029', 'S001', 'The Role of Milk in Sports Nutrition', '2024-05-24', 'Explore how milk can serve as a natural source of hydration, protein, and electrolytes for athletes and fitness enthusiasts.'),
('BLOG030', 'S001', 'Dairy-Free Baking Tips', '2024-05-24', 'Master the art of dairy-free baking with these helpful tips and ingredient substitutions for delicious treats without the dairy.');
