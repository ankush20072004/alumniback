const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Define the Alumni, College, and Student schemas and models
const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  addInfo: {
    firstName: String,
    lastName: String,
    collegeName: String,
    branch: String,
    batch: String,
    currentCompany: String,
    position: String,
    termsAccepted: Boolean,
  },
});

const collegeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  addInfo:{
    collegeName:String,
    collegeCode:String,
    establishingYear:String,
    collegeDirector:String,
    coursesAvailable:String,
    numOfAlumni:String,
  }
});

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  addInfo:{
    firstName:String,
    lastName:String,
    currentYear:String,
    branch:String,
    batch:String,
    collegeName:String,
    position:String,
    termsCheckbox:Boolean,
  }
});

const Alumni = mongoose.model('Alumni', alumniSchema);
const College = mongoose.model('College', collegeSchema);
const Student = mongoose.model('Student', studentSchema);

// Routes for registering users
app.post('/register/alumnilist', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newAlumni = new Alumni({ name, email, password });
    await newAlumni.save();
    res.status(201).json({ message: 'Alumni registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering alumni', details: error.message });
    console.error('Error saving alumni:', error.message);
  }
});

app.post('/register/colleges', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newCollege = new College({ name, email, password });
    await newCollege.save();
    res.status(201).json({ message: 'College registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering college', details: error.message });
    console.error('Error saving college:', error.message);
  }
});

app.post('/register/students', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newStudent = new Student({ name, email, password });
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering student', details: error.message });
    console.error('Error saving student:', error.message);
  }
});
// PUT route for updating alumni profile
app.put('/update/alumni/:id', async (req, res) => {
  const userId = req.params.id;
  
  // Validate the userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      userId, 
      { $set: { addInfo: req.body.addInfo } }, 
      { new: true, runValidators: true }
    );

    if (!updatedAlumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedAlumni });
  } catch (error) {
    res.status(400).json({ error: 'Error updating alumni profile', details: error.message });
  }
});
app.put('/update/college/:id', async (req, res) => {
  console.log('Request body:', req.body);
  const userId = req.params.id;

  // Validate the userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedCollege = await College.findByIdAndUpdate(
      userId, 
      { $set: { addInfo: req.body.addInfo } }, 
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.status(200).json({ message: 'College updated successfully', updatedCollege });
  } catch (error) {
    console.error('Error updating college profile:', error); // Log the error details
    res.status(400).json({ error: 'Error updating college profile', details: error.message });
  }
});
app.put('/update/student/:id', async (req, res) => {
  console.log('Request body:', req.body);
  const userId = req.params.id;

  // Validate the userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      userId, 
      { $set: { addInfo: req.body.addInfo } }, 
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    console.error('Error updating student profile:', error); // Log the error details
    res.status(400).json({ error: 'Error updating student profile', details: error.message });
  }
});


// Route for updating alumni profile with additional information
app.post('/update/alumni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const addInfo = req.body;

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      id,
      { addInfo },
      { new: true }
    );

    if (!updatedAlumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json({ message: 'Alumni profile updated successfully', updatedAlumni });
  } catch (error) {
    res.status(400).json({ error: 'Error updating alumni profile', details: error.message });
    console.error('Error updating alumni profile:', error.message);
  }
});
app.post('/update/college/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const addInfo = req.body;

    const updatedCollege = await College.findByIdAndUpdate(
      id,
      { addInfo },
      { new: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json({ message: 'College profile updated successfully', updatedCollege });
  } catch (error) {
    res.status(400).json({ error: 'Error updating college profile', details: error.message });
    console.error('Error updating college profile:', error.message);
  }
});
app.post('/update/student/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const addInfo = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { addInfo },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student profile updated successfully', updatedStudent });
  } catch (error) {
    res.status(400).json({ error: 'Error updating student profile', details: error.message });
    console.error('Error updating Student profile:', error.message);
  }
});

// Login routes for Alumni, College, and Student
app.post('/login-alumnilist', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const alumni = await Alumni.findOne({ email: emailOrPhone });

    if (!alumni || alumni.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', alumni });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

app.post('/login-colleges', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const college = await College.findOne({ email: emailOrPhone });

    if (!college || college.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', college });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

app.post('/login-students', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const student = await Student.findOne({ email: emailOrPhone });

    if (!student || student.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

app.get('/api/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find(); // Fetch all alumni from the database
    res.status(200).json(alumni); // Send the alumni data back as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error fetching alumni data', details: error.message });
  }
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
