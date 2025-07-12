const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Skill = require("../models/Skill");
const Admin = require("../models/Admin");

// Sample skills data
const sampleSkills = [
  // Technology
  {
    name: "JavaScript",
    category: "Technology",
    description: "Programming language for web development",
  },
  {
    name: "Python",
    category: "Technology",
    description: "Versatile programming language",
  },
  {
    name: "React",
    category: "Technology",
    description: "JavaScript library for building user interfaces",
  },
  {
    name: "Node.js",
    category: "Technology",
    description: "JavaScript runtime for server-side development",
  },
  { name: "MongoDB", category: "Technology", description: "NoSQL database" },
  {
    name: "Git",
    category: "Technology",
    description: "Version control system",
  },
  {
    name: "Docker",
    category: "Technology",
    description: "Containerization platform",
  },
  {
    name: "AWS",
    category: "Technology",
    description: "Cloud computing platform",
  },

  // Creative
  {
    name: "Photoshop",
    category: "Creative",
    description: "Image editing software",
  },
  {
    name: "Illustrator",
    category: "Creative",
    description: "Vector graphics editor",
  },
  {
    name: "InDesign",
    category: "Creative",
    description: "Desktop publishing software",
  },
  {
    name: "Photography",
    category: "Creative",
    description: "Art and practice of taking photographs",
  },
  {
    name: "Video Editing",
    category: "Creative",
    description: "Post-production video editing",
  },
  {
    name: "Graphic Design",
    category: "Creative",
    description: "Visual communication design",
  },
  {
    name: "UI/UX Design",
    category: "Creative",
    description: "User interface and experience design",
  },

  // Language
  {
    name: "English",
    category: "Language",
    description: "English language teaching and learning",
  },
  {
    name: "Spanish",
    category: "Language",
    description: "Spanish language teaching and learning",
  },
  {
    name: "French",
    category: "Language",
    description: "French language teaching and learning",
  },
  {
    name: "German",
    category: "Language",
    description: "German language teaching and learning",
  },
  {
    name: "Chinese",
    category: "Language",
    description: "Chinese language teaching and learning",
  },
  {
    name: "Japanese",
    category: "Language",
    description: "Japanese language teaching and learning",
  },
  {
    name: "Korean",
    category: "Language",
    description: "Korean language teaching and learning",
  },

  // Business
  {
    name: "Project Management",
    category: "Business",
    description: "Planning and organizing project resources",
  },
  {
    name: "Marketing",
    category: "Business",
    description: "Promotion and selling of products or services",
  },
  {
    name: "Sales",
    category: "Business",
    description: "Selling products or services",
  },
  {
    name: "Accounting",
    category: "Business",
    description: "Financial record keeping and reporting",
  },
  {
    name: "Business Strategy",
    category: "Business",
    description: "Long-term business planning",
  },
  {
    name: "Leadership",
    category: "Business",
    description: "Leading and managing teams",
  },

  // Health
  {
    name: "Yoga",
    category: "Health",
    description: "Physical, mental, and spiritual practices",
  },
  {
    name: "Meditation",
    category: "Health",
    description: "Mindfulness and relaxation techniques",
  },
  {
    name: "Nutrition",
    category: "Health",
    description: "Diet and healthy eating",
  },
  {
    name: "Fitness Training",
    category: "Health",
    description: "Physical exercise and training",
  },
  {
    name: "Mental Health",
    category: "Health",
    description: "Psychological well-being",
  },
  {
    name: "First Aid",
    category: "Health",
    description: "Emergency medical care",
  },

  // Education
  {
    name: "Mathematics",
    category: "Education",
    description: "Mathematical concepts and problem solving",
  },
  {
    name: "Science",
    category: "Education",
    description: "Scientific concepts and experiments",
  },
  {
    name: "History",
    category: "Education",
    description: "Historical events and analysis",
  },
  {
    name: "Literature",
    category: "Education",
    description: "Reading and writing skills",
  },
  {
    name: "Music Theory",
    category: "Education",
    description: "Musical concepts and composition",
  },
  {
    name: "Art History",
    category: "Education",
    description: "History of art and artists",
  },

  // Other
  {
    name: "Cooking",
    category: "Other",
    description: "Culinary arts and food preparation",
  },
  {
    name: "Gardening",
    category: "Other",
    description: "Plant cultivation and care",
  },
  {
    name: "Carpentry",
    category: "Other",
    description: "Woodworking and construction",
  },
  {
    name: "Plumbing",
    category: "Other",
    description: "Water and drainage systems",
  },
  {
    name: "Electrical Work",
    category: "Other",
    description: "Electrical systems and wiring",
  },
  {
    name: "Auto Repair",
    category: "Other",
    description: "Automotive maintenance and repair",
  },
];

// Sample admin data
const sampleAdmin = {
  name: "Super Admin",
  email: "admin@skillswap.com",
  password: "Admin123!",
  role: "superadmin",
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Seed skills
const seedSkills = async () => {
  try {
    // Clear existing skills
    await Skill.deleteMany({});
    console.log("🗑️ Cleared existing skills");

    // Create skills with admin flag
    const skillsWithAdminFlag = sampleSkills.map((skill) => ({
      ...skill,
      createdByAdmin: true,
      isActive: true,
    }));

    const createdSkills = await Skill.insertMany(skillsWithAdminFlag);
    console.log(`✅ Created ${createdSkills.length} skills`);

    return createdSkills;
  } catch (error) {
    console.error("❌ Error seeding skills:", error);
    throw error;
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: sampleAdmin.email });
    if (existingAdmin) {
      console.log("👤 Admin user already exists");
      return existingAdmin;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(sampleAdmin.password, salt);

    // Create admin
    const admin = new Admin({
      ...sampleAdmin,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Created admin user");
    console.log(`📧 Email: ${sampleAdmin.email}`);
    console.log(`🔑 Password: ${sampleAdmin.password}`);

    return admin;
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
};

// Create sample users
const seedSampleUsers = async () => {
  try {
    // Clear existing users (except admins)
    await User.deleteMany({});
    console.log("🗑️ Cleared existing users");

    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        location: "New York, NY",
        availability: ["Weekends", "Evenings"],
        isPublic: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "Password123!",
        location: "Los Angeles, CA",
        availability: ["Weekdays", "Mornings"],
        isPublic: true,
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: "Password123!",
        location: "Chicago, IL",
        availability: ["Flexible"],
        isPublic: true,
      },
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    // Seed in order
    await seedSkills();
    await seedAdmin();
    await seedSampleUsers();

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Sample Data:");
    console.log("- Skills: 50+ skills across 7 categories");
    console.log("- Admin: admin@skillswap.com / Admin123!");
    console.log("- Users: 3 sample users with different locations");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
