import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import TokenAndCookie from "../utils/TokenAndCookie.js";

export const SingUp = async (req, res) => {
  try {
    // Destructure the user input from the request body
    const { email, password, name } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check for empty fields
    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
      return res.status(400).json({
        message: "Fields cannot be empty",
      });
    }

    // Validate the email format
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    //email exists check
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(405).json({
        message: "This Email Address already exists",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password should be at least 6 characters",
      });
    }

    const CreateUser = await User.create({
      email: email,
      password: await bcrypt.hash(password, 11),
      name: name,
    });

    if (!CreateUser) {
      return res.status(404).json({
        status: "fail",
        message: "Something went wrong",
      });
    }

    return res.status(201).json({
      status: "success",
      user: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export const Login = async (req, res) => {
  try {
    // Destructure email and password from request body
    const { email, password } = req.body;

    //check cookies
    const alreadyLoginCheck = req.cookies.token;
    if (alreadyLoginCheck) {
      return res.status(400).json({
        status: "login",
        message: "Already logged in",
      });
    }

    // Validate that email and password fields are provided
    if (!email || !password) {
      return res.status(403).json({
        message: "All fields are required",
      });
    }

    // Check for empty fields
    if ((email.trim() == "", password.trim() == "")) {
      return res.status(400).json({
        message: "Fields cannot be empty",
      });
    }

    // Find the user in the database by email
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message: "this email does not have an account",
      });
    }

    //compare password
    const MatchPassword = await bcrypt.compare(password, findUser.password);
    if (!MatchPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Create a token and set a cookie for the logged-in user
    await TokenAndCookie(findUser._id, res);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export const userFind = async (req, res) => {
  try {
    // Extract user ID from request headers
    const id = req.headers.id;

    //find user by id in database
    const userInfo = await User.findById(id, {
      _id: 0,
      name: 1,
      email: 1,
    });

    return res.status(200).json({
      status: "success",
      userInfo: userInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export const Update = async (req, res) => {
  try {
    // Extract user ID from request headers
    const userId = req.headers.id;
    // Destructure email and password from request bod
    const { email, name } = req.body;

    // Check if either email or name is provided
    if (!email && !name) {
      return res.status(404).json({
        message: "Email Address or Number Field is required",
      });
    }

    // Check if both fields are empty strings
    if (email === "" && name === "") {
      return res.status(400).json({
        message: "Either email or number should be changed",
      });
    }

    //find user by id in database
    const userFind = await User.findOne({ _id: userId });

    // Check if the new email and name are the same as the current values
    if (email == userFind.email && name == userFind.name) {
      return res.status(400).json({
        message: "your haven't changed anything",
      });
    }

    // Validate email format if provided
    if (email) {
      const isValidEmail = validator.isEmail(email);
      if (!isValidEmail) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }
    }

    // Update user information in the database
    const update = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          email,
          name,
        },
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({
        message: "Update Failed",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Update Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};
