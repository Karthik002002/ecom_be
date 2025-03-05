import bcrypt from "bcryptjs";
import User from "../Model/UserModel.js";
import { sequelize } from "../db/Config.js";
import readline from "readline";
import { Product } from "../Model/ProductModel.js"; // Adjust path as needed

const createAdmin = async () => {
  try {
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      phone_number: 1234567890,
      user_role: 1,
      password: hashedPassword,
    });

    console.log("Admin user created:", adminUser.toJSON());
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await sequelize.close();
  }
};

// Run function
// createAdmin();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const parseFloatInput = (input) => {
  const num = parseFloat(input);
  return isNaN(num) ? null : num;
};

const getProductDetails = async () => {
  const product_name = await askQuestion("Enter product name: ");
  const price = parseFloatInput(await askQuestion("Enter product price: "));
  const quantity = parseInt(await askQuestion("Enter product quantity: "), 10);
  const discount = await askQuestion(
    "Enter discount (or leave empty for NULL): "
  );

  if (!product_name || isNaN(price) || isNaN(quantity)) {
    console.log("Invalid input. Please enter valid values.");
    return null;
  }

  return {
    product_name,
    price,
    quantity,
    discount: discount ? parseFloat(discount) : null, // Convert to float if entered, else set NULL
  };
};

const createData = async () => {
  try {
    while (true) {
      const productData = await getProductDetails();

      if (!productData) continue; // Skip invalid input

      // Check if product already exists
      const existingProduct = await Product.findOne({
        where: { product_name: productData.product_name },
      });

      if (existingProduct) {
        console.log("Product already exists:", existingProduct.toJSON());
      } else {
        // Create new product
        const newProduct = await Product.create(productData);
        console.log("New product added:", newProduct.toJSON());
      }

      const another = await askQuestion(
        "Do you want to add another product? (yes/no): "
      );
      if (another.toLowerCase() !== "yes") break;
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
};

// Run the function
createData();
