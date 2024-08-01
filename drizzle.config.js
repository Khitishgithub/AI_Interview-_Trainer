/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://neondb_owner:oYnwXP19Dych@ep-tight-tooth-a5iwerlw.us-east-2.aws.neon.tech/interview-mocker?sslmode=require",
    }
  };