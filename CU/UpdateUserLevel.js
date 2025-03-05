import readline from "readline";
import User from "../Model/UserModel.js";
import { sequelize } from "../db/Config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const updateUserLevel = async (username, newLevel) => {
  try {
    await sequelize.sync();

    const user = await User.findOne({ where: { username } });

    if (typeof newLevel !== "number") {
      return "Invalid dataType";
    }
    if (!user) {
      console.log("❌ User not found.");
    } else {
      await user.update({ user_role: newLevel });
      console.log(
        `✅ User level updated successfully: ${username} -> Level ${newLevel}`
      );
    }
  } catch (error) {
    console.error("❌ Error updating user level:", error);
  } finally {
    await sequelize.close();
    rl.close();
  }
};

// Prompt user for input
rl.question("Enter username: ", (username) => {
  rl.question("Enter new user level: ", (newLevel) => {
    if (isNaN(newLevel) || newLevel.trim() === "") {
      console.log("❌ Invalid user level. Please enter a number.");
      rl.close();
    } else {
      updateUserLevel(username.trim(), parseInt(newLevel.trim(), 10));
    }
  });
});
