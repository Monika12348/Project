// backend/server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}


const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const t = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${t}_${safe}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
    fileSize: 10 * 1024 * 1024,
  }
});

 // 8MB

// === Sequelize (MySQL) setup ===
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Models
const User = sequelize.define(
   'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  }
);

const Resume = sequelize.define(
  'Resume',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    filePath: { type: DataTypes.STRING, allowNull: true },
    text: { type: DataTypes.TEXT('long'), allowNull: true },
    analysis: { type: DataTypes.JSON, allowNull: true }
  },
  { timestamps: true, createdAt: 'created_at', updatedAt: false }
);

User.hasMany(Resume, { foreignKey: 'userId' });
Resume.belongsTo(User, { foreignKey: 'userId' });

sequelize
  .authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('MySQL error', err.message));

sequelize.sync().then(() => console.log('DB synced'));

// === helper: extract text ===
async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  } else {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    } catch (err) {
      return '';
    }
  }
}

// === SAVE RESUME endpoint ===
app.post('/api/save-resume', authenticateToken, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
  { name: "profile", maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.id;
    const title = req.body.title;
    const text = req.body.text;

    // ------------------------------
    //    FIX: HANDLE IMAGE FIELDS
    // ------------------------------
    let imagePath = null;

    if (req.files?.image?.[0]) {
      imagePath = req.files.image[0].filename;
    } else if (req.files?.file?.[0]) {
      imagePath = req.files.file[0].filename;
    } else if (req.files?.profile?.[0]) {
      imagePath = req.files.profile[0].filename;
    }

    // ------------------------------
    //       SAFE JSON PARSE
    // ------------------------------
    let data = text;

    if (typeof text === "string") {
      try {
        data = JSON.parse(text);
      } catch (err) {
        return res.status(400).json({ error: "Invalid resume JSON format" });
      }
    }

    // Add image to JSON
    data.image = imagePath || data.image || null;

    const moment = require("moment-timezone");
    const istTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const r = await Resume.create({
      userId,
      title,
      text: JSON.stringify(data),
      created_at: istTime
    });

    res.json({ message: "Saved", id: r.id });

  } catch (err) {
    console.error("Save resume error", err);
    res.status(500).json({ error: "Save failed" });
  }
});




app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await Resume.findAll({
      where: { userId },
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// === UPLOAD endpoint ===
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const text = await extractTextFromFile(req.file.path, req.file.mimetype);

    const moment = require('moment-timezone');
const istTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    const resume = await Resume.create({
      title: req.file.originalname,
      filePath: req.file.filename,
      text,
      created_at: istTime
    });

    res.json({ id: resume.id, text, fileName: req.file.originalname });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// === SMART ANALYZE endpoint ===
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, jobDesc } = req.body;
    if (!text || !jobDesc) {
      return res.status(400).json({ error: 'Missing text or jobDesc' });
    }

    const resumeText = text.toLowerCase();
    const jd = jobDesc.toLowerCase();

    const jobSkills = {
      'web developer': { html: 12, css: 10, javascript: 15, react: 12, node: 10, api: 6, sql: 5 },
      'frontend developer': { html: 12, css: 10, javascript: 15, react: 12, vue: 10, angular: 10 },
      'backend developer': { node: 12, express: 10, java: 12, python: 12, sql: 10, api: 10 },
      'full stack developer': { html: 8, css: 8, javascript: 12, react: 10, node: 10, sql: 8, api: 8 },
      'data analyst': { excel: 15, sql: 12, python: 10, tableau: 10, pandas: 8, visualization: 8, statistics: 8 },
      'data entry': { excel: 15, typing: 12, accuracy: 10, 'ms office': 8, 'data entry': 12 },
      'python developer': { python: 15, django: 10, flask: 10, pandas: 8, numpy: 8, api: 6 },
      'designer': { figma: 12, photoshop: 12, illustrator: 10, ui: 8, ux: 8 },
      'general': { communication: 8, teamwork: 8, project: 8, experience: 8 }
    };

    let jobType = 'general';
    for (const k of Object.keys(jobSkills)) {
      if (jd.includes(k)) {
        jobType = k;
        break;
      }
    }

    if (jobType === 'general') {
      if (jd.includes('data') && jd.includes('analyst')) jobType = 'data analyst';
      else if (jd.includes('web') && jd.includes('developer')) jobType = 'web developer';
      else if (jd.includes('frontend')) jobType = 'frontend developer';
      else if (jd.includes('full stack')) jobType = 'full stack developer';
    }

    const weights = jobSkills[jobType] || jobSkills['general'];

    let totalWeight = 0;
    let matchedWeight = 0;
    const matchedKeywords = [];
    const missingKeywords = [];

    const synonyms = {
      'ms office': ['ms office', 'microsoft office'],
      'sql': ['sql', 'structured query'],
      'excel': ['excel', 'ms excel', 'msexcel'],
      'javascript': ['javascript', 'js'],
      'react': ['react', 'reactjs'],
      'python': ['python'],
      'pandas': ['pandas'],
      'tableau': ['tableau']
    };

    for (const [skill, w] of Object.entries(weights)) {
      totalWeight += w;
      let found = false;

     // Case-insensitive whole-word match
const regex = new RegExp(`\\b${skill}\\b`, "i");
if (regex.test(resumeText)) found = true;

// Synonym check (case-insensitive)
if (!found && synonyms[skill]) {
  for (const syn of synonyms[skill]) {
    const synRegex = new RegExp(syn, "i");
    if (synRegex.test(resumeText)) {
      found = true;
      break;
    }
  }
}

// Partial matching: react → reactjs, python → python developer, etc
if (!found) {
  const compact = skill.replace(/\s+/g, "");
  if (resumeText.includes(compact)) found = true;

  // match first 4 letters (jav → java/javascript)
  if (resumeText.includes(skill.substring(0, 4))) found = true;
}


      if (found) {
        matchedWeight += w;
        matchedKeywords.push(skill);
      } else {
        missingKeywords.push(skill);
      }
    }

    const rawScore = totalWeight === 0 ? 0 : (matchedWeight / totalWeight) * 100;

    let score = Math.round(rawScore);
    if (!resumeText.includes('experience')) score -= 5;
    if (!resumeText.includes('skills')) score -= 5;

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // SUGGESTIONS BLOCK
const suggestions = [];

// Missing keywords suggestions
if (missingKeywords.length > 0) {
  suggestions.push(
    "Consider adding missing skills: " + missingKeywords.slice(0, 6).join(", ")
  );
}

// Structural suggestions
if (!resumeText.includes("skills")) {
  suggestions.push("Add a dedicated 'Skills' section to improve ATS readability.");
}

if (!resumeText.includes("experience")) {
  suggestions.push("Add an 'Experience' section with bullet points and achievements.");
}

if (!resumeText.includes("project")) {
  suggestions.push("Include a 'Projects' section showcasing relevant work.");
}

// Score-based recommendations
if (score >= 80) {
  suggestions.push("Strong match — consider quantifying achievements");
  suggestions.push("Highlight key projects with measurable outcomes.");
}

if (score >= 50 && score < 80) {
  suggestions.push("Add more relevant keywords from the job description.");
  suggestions.push("Improve project descriptions using action verbs such as 'Developed', 'Designed', 'Optimized'.");
}

if (score < 50) {
  suggestions.push("Your resume needs improvement — add more technical skills relevant to this job.");
  suggestions.push("Expand experience and project sections to show contributions clearly.");
}


    return res.json({
      jobType,
      score,
      matchedKeywords,
      missingKeywords,
      suggestions
    });
  } catch (err) {
    console.error('Analyze error', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});
app.get('/api/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.json(resume);
  } catch (err) {
    console.error("Resume fetch error:", err);
    res.status(500).json({ error: "Failed to load resume" });
  }
});
// ================== PDF GENERATOR FOR TEMPLATE JSON ==================
const PDFDocument = require("pdfkit");

function generateResumePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ======================
      // Basic variables
      // ======================
      let cursorY = 40;

      // ======================
      // IMAGE (Top Left)
      // ======================
      if (data.image) {
        const imgPath = path.join(__dirname, "uploads", data.image);

        if (fs.existsSync(imgPath)) {
          try {
            doc.image(imgPath, 40, cursorY, { width: 90, height: 90 });
          } catch (err) {
            console.log("Image error:", err.message);
          }
        }
        cursorY += 110; // Move down only when image exists
      }

      // ======================
      // NAME

      doc.fontSize(20).text(data.fullName || "Resume", 40, cursorY);
      cursorY += 30;

      // ======================
      // CONTACT SECTION
      // ======================
      doc.fontSize(12);
      doc.text(`Email: ${data.email || "-"}`, 40, cursorY);
      cursorY += 15;
      doc.text(`Phone: ${data.phone || "-"}`, 40, cursorY);
      cursorY += 25;

      // Reusable section writer
      function writeSection(title, value) {
        doc.fontSize(16).text(title, 40, cursorY, { underline: true });
        cursorY += 22;

        doc.fontSize(12).text(value || "Not provided", {
          width: 520,
          align: "left",
          lineGap: 3
        });

        cursorY = doc.y + 12; // Continue exactly where text ends
      }

      // ======================
      // Sections with perfect spacing
      // ======================
      writeSection("Skills", data.skills);
      writeSection("Experience", data.experience);
      writeSection("Education", data.education);

      // FORCE PAGE END EXACTLY AT LAST CONTENT
      doc.moveTo(40, doc.y).lineTo(570, doc.y).stroke();

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}






app.delete('/api/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findByPk(id);

    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete file if exists
    if (resume.filePath) {
      const filePath = path.join(UPLOAD_DIR, resume.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await resume.destroy();

    return res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error("Delete resume error:", err);
    res.status(500).json({ error: 'Delete failed' });
  }
});




// === Serve saved file ===
app.get('/uploads/:filename', (req, res) => {
  const p = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(p)) res.sendFile(p);
  else res.status(404).send('Not found');
});

// === REGISTER ===
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name,Email and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      message: 'Registration successful!',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// === LOGIN ===
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '4h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// === SERVER START ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
